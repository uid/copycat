import static org.junit.Assert.*;
import org.junit.Test;

public class ZeroTest {

  @Test
  public void testEqualsZero() {
    assertEquals(0, ZeroClass.returnZero());
  }

  @Test
  public void testEqualsOne() {
  	assertFalse(ZeroClass.returnZero() == 1);
  }
}