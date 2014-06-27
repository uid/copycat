import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

public class ListsTest {

  @Test
  public void getTest() {
    List<String> L = new ArrayList<String>();
    L.add("Test");
    assertEquals("Test", ListsClass.get(L, 0));
  }
    
  @Test
  public void appendTest() {
    List<String> L = new ArrayList<String>();
    ListsClass.append(L, "Test");
    assertEquals("Test", L.get(0));
  }

  @Test
  public void userTest4() {
    ListsClass.append(new ArrayList<String>(), "");
  }

  @Test
  public void userTest8() {
    // Your Code Here
    List<String> lst = new ArrayList<String>();
    lst.add("a");
    lst.add("b");
    lst.add("c");
    assertTrue(ListsClass.get(lst, 1).equals("b"));
  }


  @Test
  public void userTest2() {
    List<String> list = new ArrayList<String>();
    ListsClass.append(list, "");
    ListsClass.append(list, "a");
    ListsClass.append(list, "384576023847562938475");
    
    assertEquals("", ListsClass.get(list, 0));
    assertEquals("a", ListsClass.get(list, 1));
    assertEquals("", ListsClass.get(list, 0));
    
  }
  
}
