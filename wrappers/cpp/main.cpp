/*
 * ipaShip — C++ wrapper
 * Compile: g++ -std=c++17 -o ipaship main.cpp
 * Usage:   ./ipaship --dir ./ --platform ios
 */
#include <cstdlib>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

int main(int argc, char* argv[]) {
    std::ostringstream cmd;
    cmd << "npx --yes @async-atharv/ipaship";

    for (int i = 1; i < argc; ++i) {
        cmd << " " << argv[i];
    }

    int status = std::system(cmd.str().c_str());

    if (status == -1) {
        std::cerr << "Error: failed to execute npx" << std::endl;
        return 1;
    }

#ifdef _WIN32
    return status;
#else
    return WEXITSTATUS(status);
#endif
}
