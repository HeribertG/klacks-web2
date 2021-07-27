using System.Collections.Generic;

namespace klacks_web_api.BasicScriptInterpreter
{
  /// Wird gebraucht, um compilierte Code immer wieder zu gebrauchen ohne erneute Compilierung
  /// Script enthält alle externen Variablennamen
  // Code ein Clone der  compilierten Code Klasse
  class ScriptCode
    {
        public List<string> importList  { get; set; }
        public Code currentCode { get; set; }
        public string script { get; set; }
    }
}
