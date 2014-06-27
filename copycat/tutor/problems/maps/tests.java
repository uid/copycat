import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;

public class MapsTest {

  @Test
  public void testReturnValue() {
    Map<String, String> map = new HashMap<String, String>();
    map.put("hello", "there");
    assertEquals("there", MapsClass.getValue(map, "hello", "test"));
  }
    
  @Test
  public void testReturnDefault() {
    Map<String, String> map = new HashMap<String, String>();
    assertEquals("test", MapsClass.getValue(map, "hello", "test"));
  }


  @Test
  public void yourTest1() {
    // Your Code Here
    Map<String, String> test1 = new HashMap<String, String>();
    test1.put("key", "keyValue");
    assertEquals(true, MapsClass.getValue(test1, "key", "derp").equals("keyValue"));
    assertEquals(true, MapsClass.getValue(test1, "key??", "derp").equals("derp"));
  }

  @Test
  public void yourTest2() {
    Map<String, String> map = new HashMap<String, String>();
    map.put("test1", "test1");
    String ans = MapsClass.getValue(map, "test1", "df");
    assertEquals(ans, "test1"); 
    String ans2 = MapsClass.getValue(map, "test2", "df");
    assertEquals(ans2, "df");
  }

  @Test
  public void yourTest3() {
    Map<String, String> test = new HashMap<String, String>();
    assertEquals("hi", MapsClass.getValue(test, "key", "hi"));
  }

  @Test
  public void yourTest4() {
    // Your Code Here
    Map<String, String> map = new HashMap<String, String>();
    map.put("a", "apple");
    assertEquals(MapsClass.getValue(map, "a", "df"), "apple");
    assertEquals(MapsClass.getValue(map, "b", "df"), "df");
  }

  @Test
  public void yourTest5() {
    assertEquals("hello", MapsClass.getValue(new HashMap<String, String>(), "hi", "hello"));
    
    Map<String, String> myMap = new HashMap<String, String>();
    myMap.put("name", "Bobby");
    
    assertEquals("Bobby", MapsClass.getValue(myMap, "name", "Jimmy"));
  }

  @Test
  public void yourTest6() {
    Map<String, String> map = new HashMap<String, String>();
    String key = "hi";
    String df1 = "blah";
    String df2 = "blah2";
    
    assertEquals(df1, MapsClass.getValue(map, key, df1));
    assertEquals(df1, MapsClass.getValue(map, key, df2));
  }

}
