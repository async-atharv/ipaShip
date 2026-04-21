cmake_minimum_required(VERSION 3.10)
project(ipaship VERSION 1.3.0 LANGUAGES C)

add_executable(ipaship main.c)

install(TARGETS ipaship DESTINATION bin)
