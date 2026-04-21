cmake_minimum_required(VERSION 3.10)
project(ipaship VERSION 1.3.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(ipaship main.cpp)

install(TARGETS ipaship DESTINATION bin)
