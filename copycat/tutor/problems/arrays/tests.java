import static org.junit.Assert.*;
import org.junit.Test;
import java.util.Arrays;

public class ArraysTest {

  @Test
  public void testPositive() {
    assertArrayEquals(new int[] {3, 4}, ArraysClass.addTwo(new int[] {1, 2}));
  }

  @Test
  public void testNegative() {
  	assertArrayEquals(new int[] {-4, -6}, ArraysClass.addTwo(new int[] {-6, -8}));
  }

  @Test
  public void yourTest1() {
    // Your Code Here
    int [] testArray = {0, 1, 2, 3, -4};
    int [] modifiedArray = {2, 3, 4, 5, -2};
    
    int [] test1 = {0};
    int [] testAdd1 = {2};
    assertEquals(true, Arrays.equals(ArraysClass.addTwo(test1), testAdd1));
    assertEquals(true, Arrays.equals(ArraysClass.addTwo(testArray), modifiedArray));
  }

  @Test
  public void yourTest2() {
    int[] num = new int[]{1, 2, 3};
    int[] correctNum = new int[]{3, 6, 9};
    assertEquals(ArraysClass.addTwo(num)[0], correctNum[0]);
    assertEquals(ArraysClass.addTwo(num)[1], correctNum[1]);
    assertEquals(ArraysClass.addTwo(num)[2], correctNum[2]);
  }

  @Test
  public void yourTest3() {
    int[] testArray = {2, 4};
    int[] answerArray = {4, 6};
    assertArrayEquals(answerArray, ArraysClass.addTwo(testArray));
  }

  @Test
  public void yourTest4() {
    int[] t = {2,7};
    int[] r = ArraysClass.addTwo(t);
    assertEquals(4,r[0]);
    assertEquals(9,r[1]);
      
  }

  @Test
  public void yourTest5() {
    int[] A = new int[4];
    for ( int i = 0; i < 4; i++) {
        A[i] = i; 
    }
    
    int[] B = ArraysClass.addTwo(A);
    assertTrue(B[0] == 2);
    
  }

  @Test
  public void yourTest6() {
                int[] testArray = ArraysClass.addTwo(new int[] {0, 1, 2, 5});
    assertArrayEquals(new int[] {2, 3, 4, 7}, testArray);
  }

  @Test
  public void yourTest7() {
    int[] ary = new int[0];
    assertEquals(0, ArraysClass.addTwo(ary).length);
    ary = new int[]{1};
    int[] out = ArraysClass.addTwo(ary);
    assertArrayEquals(ary, out);
  }

}