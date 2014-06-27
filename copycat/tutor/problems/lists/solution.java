import java.util.List;

public class ListsClass {
  public static String get(List<String> lst, int i) {
    return lst.get(i);
  }
    
  public static void append(List<String> lst, String s) {
    lst.add(s);
  }
}
