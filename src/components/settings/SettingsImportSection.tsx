"use client";

import { useRef, useState } from "react";
import {
  Box,
  Button,
  Alert,
  Typography,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  alpha,
} from "@mui/material";
import { Upload, FileUpload } from "@mui/icons-material";
import {
  usePreviewImportMutation,
  useImportBooksMutation,
} from "@/redux/api/books";
import type { ImportPreview } from "@/types/books";
import ProfileSection from "@/components/profile/ProfileSection";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { modalPrimaryButtonSx } from "@/components/book/modalTheme";

export default function SettingsImportSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [previewImport, { isLoading: previewing }] = usePreviewImportMutation();
  const [importBooks, { isLoading: importing }] = useImportBooksMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setPreview(null);

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }

    const text = await file.text();
    setCsvText(text);
    setFileName(file.name);

    try {
      const result = await previewImport({ csv: text }).unwrap();
      setPreview(result);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { message?: string } }).data?.message)
          : "Could not parse CSV file.";
      setError(message);
    }
  };

  const handleImport = async () => {
    if (!csvText) return;

    setError(null);
    setSuccess(null);

    try {
      const result = await importBooks({ csv: csvText, skipDuplicates }).unwrap();
      setSuccess(
        `Imported ${result.imported} book${result.imported === 1 ? "" : "s"}` +
          (result.skippedDuplicates > 0
            ? ` · ${result.skippedDuplicates} duplicate${result.skippedDuplicates === 1 ? "" : "s"} skipped`
            : "") +
          (result.invalidRows > 0 ? ` · ${result.invalidRows} invalid rows` : "") +
          "."
      );
      setPreview(null);
      setCsvText("");
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { message?: string } }).data?.message)
          : "Import failed.";
      setError(message);
    }
  };

  return (
    <ProfileSection title="Import library" accent={DASH.wine}>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.875rem",
          color: alpha(DASH.dark, 0.6),
          mb: 2,
          lineHeight: 1.5,
        }}
      >
        Upload a CSV export from another reading app or a Katalog export to add books in bulk.
        Use the library export option from wherever you currently track your reads.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          {success}
        </Alert>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={handleFileChange}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FileUpload />}
          onClick={() => fileRef.current?.click()}
          disabled={previewing}
          sx={{
            textTransform: "none",
            fontFamily: DASH.font,
            borderColor: alpha(DASH.wine, 0.3),
            color: DASH.wine,
          }}
        >
          {previewing ? "Reading file…" : fileName || "Choose CSV file"}
        </Button>
      </Box>

      {preview && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: DASH.font,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: DASH.dark,
              mb: 1,
            }}
          >
            Preview · {preview.format === "external" ? "Library export" : "Katalog export"} ·{" "}
            {preview.validCount} of {preview.totalRows} rows ready
          </Typography>

          {preview.invalidCount > 0 && (
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.8125rem",
                color: DASH.wine,
                mb: 1,
              }}
            >
              {preview.invalidCount} row{preview.invalidCount === 1 ? "" : "s"} will be skipped.
            </Typography>
          )}

          <Box
            sx={{
              maxHeight: 220,
              overflow: "auto",
              border: `1px solid ${alpha(DASH.dark, 0.1)}`,
              mb: 2,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: DASH.font, fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontFamily: DASH.font, fontWeight: 700 }}>Author</TableCell>
                  <TableCell sx={{ fontFamily: DASH.font, fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontFamily: DASH.font, fontWeight: 700 }}>Pages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.preview.map((row) => (
                  <TableRow
                    key={row.rowNumber}
                    sx={{
                      opacity: row.valid ? 1 : 0.5,
                      bgcolor: row.valid ? "transparent" : alpha(DASH.wine, 0.04),
                    }}
                  >
                    <TableCell sx={{ fontFamily: DASH.font, fontSize: "0.8125rem" }}>
                      {row.title || "—"}
                    </TableCell>
                    <TableCell sx={{ fontFamily: DASH.font, fontSize: "0.8125rem" }}>
                      {row.author || "—"}
                    </TableCell>
                    <TableCell sx={{ fontFamily: DASH.font, fontSize: "0.8125rem" }}>
                      {row.status || "—"}
                    </TableCell>
                    <TableCell sx={{ fontFamily: DASH.font, fontSize: "0.8125rem" }}>
                      {row.pages ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={skipDuplicates}
                onChange={(e) => setSkipDuplicates(e.target.checked)}
                sx={{
                  color: alpha(DASH.wine, 0.5),
                  "&.Mui-checked": { color: DASH.wine },
                }}
              />
            }
            label={
              <Typography sx={{ fontFamily: DASH.font, fontSize: "0.875rem" }}>
                Skip books already in my library (by ISBN or title + author)
              </Typography>
            }
            sx={{ mb: 2, ml: 0 }}
          />

          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={handleImport}
            disabled={importing || preview.validCount === 0}
            sx={modalPrimaryButtonSx}
          >
            {importing ? "Importing…" : `Import ${preview.validCount} books`}
          </Button>
        </Box>
      )}
    </ProfileSection>
  );
}
