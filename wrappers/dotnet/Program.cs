using System;
using System.Diagnostics;

class Program
{
    static void Main(string[] args)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "npx",
                Arguments = "--yes @async-atharv/ipaship " + string.Join(" ", args),
                UseShellExecute = false
            }
        };
        process.Start();
        process.WaitForExit();
        Environment.Exit(process.ExitCode);
    }
}