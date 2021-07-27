using System;
using System.Collections.Generic;
using klacks_web_api.BasicScriptInterpreter;

namespace klacks_web_api.Interface
{
  public interface IMacroEngine
  {
    void PrepareMacro(Guid id, string script);
    void ResetImports();
    List<ResultMessage> Run();
    dynamic Imports { get; set; }
    void ImportItem(string key, object value);
    bool IsIde { get; set; }
    string ErrorCode { get; set; }
    int ErrorNumber { get; set; }
  }
}
