import static org.junit.Assert.*;
import org.junit.Test;

public class SubstringTest {

  @Test
  public void testNonemptyString() {
    assertEquals("hello", SubstringClass.getSubstringFromFront("hello world", 5));
  }

  @Test
  public void testEmptyString() {
  	assertEquals("", SubstringClass.getSubstringFromFront("test string", 0));
  }
}