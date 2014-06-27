import org.junit.runner.JUnitCore;

public class TestRunner {
    public static void main(String[] args) {
        JUnitCore core = new JUnitCore();
        if (args.length > 1 && args[1] == "true") {
            core.addListener(new UserTestListener());
        } else {
            core.addListener(new TestListener());
        }
        try {
            core.run(Class.forName(args[0]));
        } catch (Exception e) {
            System.out.println("Could not find class");
        }
    }
}  