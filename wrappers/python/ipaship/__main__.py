import sys, subprocess

def main():
    sys.exit(subprocess.call(["npx", "--yes", "@async-atharv/ipaship"] + sys.argv[1:]))

if __name__ == '__main__':
    main()