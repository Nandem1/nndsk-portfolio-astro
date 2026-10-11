#!/usr/bin/env python3
"""Start Astro in a new session so the launching shell can exit.

Usage: daemonize-astro.py ROOT HOST PORT LOG_FILE PID_FILE
"""

from __future__ import annotations

import os
import shutil
import sys
import time


def main() -> int:
    if len(sys.argv) != 6:
        print(
            "usage: daemonize-astro.py ROOT HOST PORT LOG_FILE PID_FILE",
            file=sys.stderr,
        )
        return 2

    root, host, port, log_file, pid_file = sys.argv[1:6]
    bun = shutil.which("bun")
    if bun is None:
        print("bun not found on PATH", file=sys.stderr)
        return 1

    if os.path.exists(pid_file):
        os.remove(pid_file)

    child = os.fork()
    if child > 0:
        deadline = time.time() + 5
        while time.time() < deadline:
            if os.path.isfile(pid_file):
                return 0
            time.sleep(0.05)
        print("daemonize: grandchild did not write pid file", file=sys.stderr)
        return 1

    os.setsid()
    if os.fork() > 0:
        os._exit(0)

    os.chdir(root)
    os.umask(0)

    with open(pid_file, "w", encoding="utf-8") as handle:
        handle.write(str(os.getpid()))

    devnull = os.open(os.devnull, os.O_RDWR)
    logfd = os.open(
        log_file,
        os.O_WRONLY | os.O_CREAT | os.O_TRUNC,
        0o644,
    )
    os.dup2(devnull, 0)
    os.dup2(logfd, 1)
    os.dup2(logfd, 2)
    if devnull > 2:
        os.close(devnull)
    if logfd > 2:
        os.close(logfd)

    os.execv(bun, [bun, "run", "astro", "--", "dev", "--host", host, "--port", port])
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
