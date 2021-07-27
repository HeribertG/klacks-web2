using System;

namespace klacks_web_api.BasicScriptInterpreter
{
  public static class Formathelper
    {

        public static double FormatDoubleNumber(string value)
        {
            double number = 0;

            try
            {
                number = Convert.ToDouble(value);
            }
            catch (Exception ex)
            {
                if (ex.HResult == -2146233033)
                {
                    if (value.Contains("."))
                    {
                        value = value.Replace(".", ",");
                        number = Convert.ToDouble(value);
                    }
                    else if (value.Contains(","))
                    {
                        value = value.Replace(",", ".");
                        number = Convert.ToDouble(value);
                    }
                }
            }

            return number;
        }
    }
}
