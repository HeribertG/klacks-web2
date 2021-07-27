using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;


namespace klacks_web_api.BasicScriptInterpreter
{


// Das jeweils zuoberst liegende Scope-Objekt dient dabei als
// normaler Programm-Stack.
//
// Variablen symboltable (SyntaxAnalyser.cls) und scopes (Code.cls)
// sind Scopes-Objekte.
    public class Scopes
    {
        private List<Scope> _scopes = new List<Scope>();


        public void PushScope(Scope s = null)
        {
            if (s == null)
                _scopes.Add(new Scope());
            else
            {
                _scopes.Add(s);
            }

        }


        public Identifier PopScopes(int? index = null)
        {
            var ind = -1;
            if (index.HasValue) { ind = index.Value; }
            var scope = _scopes[_scopes.Count() - 1];
            var result = scope.Pop(ind);

            return result;
        }

        public Identifier Allocate(string name, object value = null, Identifier.IdentifierTypes idType = Identifier.IdentifierTypes.idVariable)
        {
            return _scopes[_scopes.Count() - 1].Allocate(name, value, idType);
        }

        // Von oben nach unten alle Scopes durchgehen und dem
        // ersten benannten Wert mit dem übergebenen Namen den
        // Wert zuweisen.
        public bool Assign(string name, object value)
        {
            var variable = GetVariable(name);
            if (variable !=null)
            {
                variable.value = value;
                return true;
            }

            return false;
          
        }

        // dito, jedoch Wert zurückliefern (als kompletten Identifier)
        public Identifier Retrieve(string name)
        {
            return GetVariable(name);
        }

        public bool Exists(string name, bool? inCurrentScopeOnly = false, Identifier.IdentifierTypes? idType = Identifier.IdentifierTypes.idNone)
        {

            int i, n;
            Identifier renamed;
            Scope s;
            var result = false;

            n = inCurrentScopeOnly == true ? this._scopes.Count() - 1 : 0;

            for (i = _scopes.Count() - 1; i >= n; i += -1)
            {
                s = _scopes[i];
                renamed = (Identifier)s.GetVariable(name);

                if (renamed != null)
                {
                    if (renamed.name == name)
                    {
                        // Prüfen, ob gefundener Wert vom gewünschten Typ ist
                        if (idType == Identifier.IdentifierTypes.idNone)
                        { result = true; }
                        else
                        {
                            if (idType == Identifier.IdentifierTypes.idIsVariableOfFunction)
                            {
                                if (renamed.idType == Identifier.IdentifierTypes.idVariable || renamed.idType == Identifier.IdentifierTypes.idFunction)
                                {
                                    result = true;
                                }
                            }
                            else if (idType == Identifier.IdentifierTypes.idSubOfFunction)
                            {
                                if (renamed.idType == Identifier.IdentifierTypes.idSub || renamed.idType == Identifier.IdentifierTypes.idFunction)
                                {
                                    result = true;
                                }
                            }
                            else if (idType == Identifier.IdentifierTypes.idFunction)
                            {
                                if (renamed.idType == Identifier.IdentifierTypes.idSub || renamed.idType == Identifier.IdentifierTypes.idFunction)
                                {
                                    result = true;
                                }
                            }
                            else if (idType == Identifier.IdentifierTypes.idFunction)
                            {
                                if (renamed.idType == Identifier.IdentifierTypes.idFunction)
                                {
                                    result = true;
                                }
                            }
                            else if (idType == Identifier.IdentifierTypes.idSub)
                            {
                                if (renamed.idType == Identifier.IdentifierTypes.idSub)
                                {
                                    result = true;
                                }
                            }
                            else if (idType == Identifier.IdentifierTypes.idVariable)
                            {
                                if (renamed.idType == Identifier.IdentifierTypes.idVariable)
                                {
                                    result = true;
                                }
                            }
                        }

                    }
                    return result;

                }
            }

            return result;

        }

        public void Push(object value)
        {

            if (value != null)
            {
                Scope s = _scopes[_scopes.Count() - 1];
                var c = new Identifier();
                c.value = value;
                s.Push(c);
            }
        }

        public object Pop(int index = -1)
        {

            Scope s;
            object x;
            for (int i = _scopes.Count - 1; i >= 0; i += -1)
            {
                s = _scopes[i];
                x = s.Pop(index);
                if (x != null)
                    return x;
            }
            return null;
        }


        private Identifier GetVariable(string name)
        {

            Scope s;
            Identifier x;
            try
            {
                for (int i = _scopes.Count - 1; i >= 0; i += -1)
                {
                    s = _scopes[i];
                    x = (Identifier)s.GetVariable(name);
                    if (x != null)
                        return x;
                }
            }
            catch (Exception ex)
            {
                Debug.Print("Scope.zVariable: " + ex.Message);
            }

            return null;

        }

        ~Scopes()
        {
            _scopes.Clear();
        }
    }

}
