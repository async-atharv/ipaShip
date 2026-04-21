/*
 * ipaShip — C wrapper
 * Compile: gcc -o ipaship main.c
 * Usage:   ./ipaship --dir ./ --platform ios
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
    /* Build command: npx --yes @async-atharv/ipaship <args...> */
    size_t len = 64; /* base: "npx --yes @async-atharv/ipaship" */
    for (int i = 1; i < argc; i++) {
        len += strlen(argv[i]) + 3; /* space + quotes */
    }

    char *cmd = (char *)malloc(len);
    if (!cmd) {
        fprintf(stderr, "Error: out of memory\n");
        return 1;
    }

    strcpy(cmd, "npx --yes @async-atharv/ipaship");
    for (int i = 1; i < argc; i++) {
        strcat(cmd, " ");
        strcat(cmd, argv[i]);
    }

    int status = system(cmd);
    free(cmd);

    if (status == -1) {
        fprintf(stderr, "Error: failed to execute npx\n");
        return 1;
    }

#ifdef _WIN32
    return status;
#else
    return WEXITSTATUS(status);
#endif
}
