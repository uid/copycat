import static org.junit.Assert.*;
import org.junit.Test;

public class StringsTest {

  @Test
  public void testEqualStrings() {
    assertTrue(StringsClass.stringEquals(new String("test"), new String("test")));
  }

  @Test
  public void testUnequalStrings() {
  	assertFalse(StringsClass.stringEquals("a", "b"));
  }

  @Test
  public void yourTest1() {
    // Your Code Here
    assertEquals(true, StringsClass.stringEquals("a", "a"));
    assertEquals(false, StringsClass.stringEquals("a", "A"));
  }

  @Test
  public void yourTest2() {
    String s1 = "";
    String s2 = "";
    assertEquals(StringsClass.stringEquals(s1, s2), s1.equals(s2));
    assertTrue(StringsClass.stringEquals(s1, s2));
  }

  @Test
  public void yourTest3() {
    String s1 = "la";
    String s2 = "la";
    assertTrue(StringsClass.stringEquals(s1, s2));
  }

  @Test
  public void yourTest4() {
        assertTrue(StringsClass.stringEquals("Dennis", "Dennis"));
  }

  @Test
  public void yourTest5() {
    assertEquals(true, StringsClass.stringEquals("hi","hi"));
  }

  @Test
  public void yourTest6() {
    // Your Code Here
    assertTrue(StringsClass.stringEquals("a","a"));
    assertFalse(StringsClass.stringEquals("a","ab"));
    assertTrue(StringsClass.stringEquals("abc","abc"));
  }

  @Test
  public void yourTest7() {
    assertTrue(true);
    assertFalse(StringsClass.stringEquals("hi", "goodbye"));
    assertFalse(StringsClass.stringEquals("boo", "far"));
    assertTrue(StringsClass.stringEquals("hello", "hello"));
  }

  @Test
  public void yourTest8() {
    String s1 = "hi";
    String s2 = "hi";
    String s3 = "bye";
    assertTrue(StringsClass.stringEquals(s1, s2));
    assertFalse(StringsClass.stringEquals(s1, s3));
  }

}