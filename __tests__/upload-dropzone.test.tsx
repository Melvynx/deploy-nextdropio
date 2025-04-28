import { UploadDropzone } from "@/components/upload-dropzone";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query", () => ({
  useMutation: ({
    mutationFn,
    onSuccess,
    onError,
  }: {
    mutationFn: (file: File) => Promise<string | null | undefined>;
    onSuccess: () => void;
    onError: (error: Error) => void;
  }) => ({
    mutate: async (file: File) => {
      try {
        await mutationFn(file);
        onSuccess();
      } catch (error) {
        onError(error as Error);
      }
    },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("UploadDropzone", () => {
  const mockUploadFile = vi.fn();
  const mockOnClientUploadComplete = vi.fn();
  const mockOnUploadError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders upload dropzone correctly", () => {
    render(
      <UploadDropzone
        uploadFile={mockUploadFile}
        onClientUploadComplete={mockOnClientUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    expect(
      screen.getByText("Drag and drop or click to upload a file")
    ).toBeDefined();
    expect(
      screen.getByText("Supports PDF, audio, video, and document files")
    ).toBeDefined();
  });

  it("handles file upload when clicked", async () => {
    mockUploadFile.mockResolvedValue("upload-success");

    render(
      <UploadDropzone
        uploadFile={mockUploadFile}
        onClientUploadComplete={mockOnClientUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    const file = new File(["file contents"], "test.pdf", {
      type: "application/pdf",
    });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalledWith(file);
      expect(mockOnClientUploadComplete).toHaveBeenCalled();
    });
  });

  it("handles upload error", async () => {
    mockUploadFile.mockResolvedValue(null);

    render(
      <UploadDropzone
        uploadFile={mockUploadFile}
        onClientUploadComplete={mockOnClientUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    const file = new File(["file contents"], "test.pdf", {
      type: "application/pdf",
    });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalledWith(file);
      expect(mockOnUploadError).toHaveBeenCalled();
    });
  });

  it("handles drag and drop", async () => {
    mockUploadFile.mockResolvedValue("upload-success");

    render(
      <UploadDropzone
        uploadFile={mockUploadFile}
        onClientUploadComplete={mockOnClientUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    const dropzone = screen
      .getByText("Drag and drop or click to upload a file")
      .closest("div");
    const file = new File(["file contents"], "test.pdf", {
      type: "application/pdf",
    });

    if (dropzone) {
      // Mock drag events
      fireEvent.dragOver(dropzone);
      expect(screen.getByText("Drop the file here")).toBeDefined();

      // Create a mock DataTransfer object
      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(dropzone, { dataTransfer });

      await waitFor(() => {
        expect(mockUploadFile).toHaveBeenCalledWith(file);
        expect(mockOnClientUploadComplete).toHaveBeenCalled();
      });
    }
  });
});
