import static org.junit.Assert.*;
import org.junit.Test;

public class EqualityTest {

  @Test
  public void testInt() {
    assertFalse(EqualityClass.intEq(3, 4));
  }

  @Test
  public void testString() {
    assertTrue(EqualityClass.stringEq(new String("test"), new String("test")));
  }


  @Test
  public void userTest8() {
    assert(EqualityClass.intEq(0, 0));
    assert(!EqualityClass.intEq(0, 1));
    
    assert(EqualityClass.stringEq("", ""));
    assert(!EqualityClass.stringEq("", "xxx"));
  }

  @Test
  public void userTest6() {
    assertFalse(EqualityClass.intEq(4, 5));
  }

  @Test
  public void userTest3() {
    EqualityClass.intEq(4,5);
  }

  @Test
  public void userTest4() {
    assertTrue(EqualityClass.intEq(0, 0));
  }


  @Test
  public void userTest5() {
    // Your Code Here
    EqualityClass.intEq(1,2);
    EqualityClass.stringEq("1","2");    
  }

  @Test
  public void userTest9() {
    assertEquals(true,EqualityClass.intEq(1,1));
  }

  @Test
  public void userTest2() {
    assertTrue(EqualityClass.intEq(-5, -5));
  }

  @Test
  public void userTest11a() {
    assertTrue(EqualityClass.intEq(5,5));
  }
  
  @Test
  public void userTest11b() {
    assertTrue(EqualityClass.stringEq("HI", "HI"));
  }

  @Test
  public void userTest12() {
    int a = 7;
    int b = 8;
    assertFalse(EqualityClass.intEq(a,b));
  }



}
