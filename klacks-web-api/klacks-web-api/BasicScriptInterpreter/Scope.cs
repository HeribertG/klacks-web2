using System;
using System.Collections.ObjectModel;
using System.Linq;



namespace klacks_web_api.BasicScriptInterpreter
{

  ///  Scope: Stackähnliche Datenstruktur, in der benannte Werte
  /// (Variablen, Konstanten) und unbenannte Werte geführt werden.
  ///
  ///  Die benannten Werte werden immer am unteren Ende des Stacks
  ///  zusammengefasst. Der Zugriff erfolgt über die Namen.
  ///
  ///  Unbenannt Werte liegen in LIFO-Manier oben auf dem Stack.
  ///  Der Zugriff erfolgt per Pop/Push .
  ///
  ///  Jedes Scope-Objekt realisiert einen eigenen Stack und
  ///  einen eigenen Namensraum, in welchem alle benannten Werte
  ///  unterschiedliche Namen haben müssen. Werte in unterschiedlichen
  ///  Scope-Objekten können gleich sein.
  public class Scope
  {
    private Collection<Identifier> Variables = new Collection<Identifier>();


    public Identifier Allocate(string name, object value = null, Identifier.IdentifierTypes idType = Identifier.IdentifierTypes.idVariable)
    {
      Identifier id = new Identifier()
      {
        name = name,
        value = value,
        idType = idType
      };


      SetVariable(id, name);

      return id;
    }


    public void Assign(string name, object value)
    {
      SetVariable(value, name);
    }


    public object Retrieve(string name)
    {
      return GetVariable(name);
    }


    public bool Exists(string name)
    {
      return GetVariable(name) != null;
    }


    public object GetVariable(string name)
    {
      try
      {
        if (Variables != null)
        {
          return Variables.Where(x => x.name == name).FirstOrDefault();
        }
        else
        {
          return null;
        }
       

      }
      catch (Exception)
      {
        return null;
      }
    }

    public void SetVariable(object value, string name)
    {
      // Benannten Wert löschen , damit es ersetzt wird
      if (Variables.Count > 0)
      {
        var tmp = Variables.Where(x => x != null && x.name == name).FirstOrDefault();
        if (tmp != null) { Variables.Remove(tmp); }
      }

      // Variablen immer am Anfang des Scopes zusammenhalten. Nach der letzten
      // Variablen kommen nur noch echte Stackwerte

      Identifier c;
      if (value is Identifier)
      {
        c = (Identifier)value;
      }
      else
      {
        c = new Identifier();
        c.name = name;
        c.value = value;
      }

      if (Variables.Count == 0) { Variables.Add(c); }
      else { Variables.Insert(0, c); }

    }


    public void Push(Identifier value)
    {
      Variables.Add(value);
    }


    ///  Holt den obersten unbenannten Wert vom Stack.
    ///  Wenn eine index übergeben wird, kann auch auf Stackwerte
    ///  direkt zugegriffen werden. In dem Fall werden sie nicht
    ///  gelöscht! Index: 0..n; 0=oberster Stackwert, 1=darunterliegender usw.
    public Identifier Pop(int index = -1)
    {
      Identifier pop = null;
      if (index < 0)
      {
        // Den obersten Stackwert vom Stack nehmen und zurückliefern
        // Die Stackwerte fangen nach der letzten benannten Variablen im Scope an

        if (Variables.Count() > 0)
        {

          pop = Variables[Variables.Count() - 1];
          Variables.Remove(pop);
        }


      }
      else
        // Eine Stackwert vom Stacktop aus gezählt (0..n) zurückliefern, der Stack
        // bleibt aber wie er ist

        pop = Variables[Variables.Count() - 1 - index];

      return pop;
    }

    internal int CloneCount()
    {
      return Variables.Count();
    }

    public object CloneItem(int index)
    {
      return Variables[index];
    }
  }

}
