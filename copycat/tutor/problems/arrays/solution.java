public class ArraysClass {
	public static int[] addTwo(int[] ints) {
		for (int i = 0; i < ints.length; i++) {
			ints[i] += 2;
		}
		return ints;
	}
}