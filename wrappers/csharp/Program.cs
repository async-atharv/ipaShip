using System;
using System.Diagnostics;
using System.Linq;

namespace IpaShip
{
    class Program
    {
        static int Main(string[] args)
        {
            try
            {
                var allArgs = "--yes @async-atharv/ipaship " + string.Join(" ", args);
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "npx",
                        Arguments = allArgs,
                        UseShellExecute = false,
                        RedirectStandardOutput = false,
                        RedirectStandardError = false
                    }
                };
                process.Start();
                process.WaitForExit();
                return process.ExitCode;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error running ipaShip: {ex.Message}");
                return 1;
            }
        }
    }
}
