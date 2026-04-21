package com.ipaship;

public class Main {
    public static void main(String[] args) {
        try {
            java.util.List<String> command = new java.util.ArrayList<>();
            command.add("npx");
            command.add("--yes");
            command.add("@async-atharv/ipaship");
            for (String arg : args) {
                command.add(arg);
            }

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.inheritIO();
            Process process = pb.start();
            int exitCode = process.waitFor();
            System.exit(exitCode);
        } catch (Exception e) {
            System.err.println("Error running ipaShip: " + e.getMessage());
            System.exit(1);
        }
    }
}
