import React, { useState, useCallback, memo } from "react";
import { Play, ChevronDown } from "lucide-react";

const FRAMEWORKS = ["Jest", "NUnit", "Pytest"] as const;
type Framework = (typeof FRAMEWORKS)[number];

const TEST_TEMPLATES: Record<Framework, string> = {
  Jest: `describe('ExampleComponent', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user input', () => {
    // Test implementation
  });

  it('should update state correctly', () => {
    // Test implementation
  });
});`,
  NUnit: `[TestFixture]
public class ExampleComponentTests
{
    [Test]
    public void Should_Render_Correctly()
    {
        // Test implementation
    }

    [Test]
    public void Should_Handle_User_Input()
    {
        // Test implementation
    }

    [Test]
    public void Should_Update_State_Correctly()
    {
        // Test implementation
    }
}`,
  Pytest: `def test_should_render_correctly():
    # Test implementation
    pass

def test_should_handle_user_input():
    # Test implementation
    pass

def test_should_update_state_correctly():
    # Test implementation
    pass`,
};

function generateTestOutput(framework: Framework): string {
  const template = TEST_TEMPLATES[framework] ?? TEST_TEMPLATES.Jest;
  return `Generated test cases for ${framework}:\n\n${template}`;
}

const Dropdown = memo(function Dropdown({
  value,
  onChange,
  isOpen,
  onToggle,
}: {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full sm:w-48 px-4 py-2 text-left text-sm text-gray-300 bg-white/5 rounded-md font-extralight flex justify-between items-center"
      >
        {value || "Select Framework"}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute w-full sm:w-48 mt-2 bg-[#0A0A0A] border border-white/10 rounded-md shadow-lg z-10"
        >
          {FRAMEWORKS.map((fw) => (
            <li key={fw}>
              <button
                role="option"
                aria-selected={value === fw}
                className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 font-extralight text-left"
                onClick={() => onChange(fw)}
              >
                {fw}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

const OutputConsole = memo(function OutputConsole({ output }: { output: string }) {
  return (
    <div className="mt-6" role="region" aria-label="Generated test output">
      <h3 className="text-sm text-gray-400 font-normal mb-2">Output Console:</h3>
      <pre className="bg-white/5 p-4 rounded-md text-xs sm:text-sm text-gray-300 font-extralight overflow-x-auto">
        {output}
      </pre>
    </div>
  );
});

const GenerateButton = memo(function GenerateButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-extralight transition-colors duration-300 ${
        disabled
          ? "bg-white/5 text-gray-500 cursor-not-allowed"
          : "bg-white/5 hover:bg-white/10 text-gray-300"
      }`}
    >
      <Play size={16} className="text-violet-400" aria-hidden="true" />
      Generate Tests
    </button>
  );
});

export default function UnitTestGenerator() {
  const [framework, setFramework] = useState<Framework>("");
  const [isOpen, setIsOpen] = useState(false);
  const [output, setOutput] = useState("");

  const handleGenerateTests = useCallback(() => {
    if (!framework) return;
    setOutput(generateTestOutput(framework));
  }, [framework]);

  const handleFrameworkSelect = useCallback((selected: Framework) => {
    setFramework(selected);
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md px-4 py-10 border border-white/10 backdrop-blur-md rounded-lg mt-20">
        <div className="px-4 sm:px-6 py-4 border-b border-white/10">
          <h2 className="text-lg sm:text-xl text-white font-thin tracking-wide">
            Unit Test Generator
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <Dropdown
            value={framework}
            onChange={handleFrameworkSelect}
            isOpen={isOpen}
            onToggle={toggleDropdown}
          />

          <GenerateButton onClick={handleGenerateTests} disabled={!framework} />

          {output && <OutputConsole output={output} />}
        </div>
      </div>
    </div>
  );
}
