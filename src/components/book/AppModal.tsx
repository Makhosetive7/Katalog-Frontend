"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  alpha,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { DASH } from "@/components/dashboard/dashboardTheme";
import {
  modalPaperSx,
  modalTitleSx,
  modalContentSx,
  modalActionsSx,
  modalLabelSx,
  modalHeadingSx,
  modalPrimaryButtonSx,
  modalGhostButtonSx,
} from "./modalTheme";

type AppModalProps = {
  open: boolean;
  onClose: () => void;
  label?: string;
  title: string;
  subtitle?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg";
  accent?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  hideActions?: boolean;
  actions?: React.ReactNode;
};

export default function AppModal({
  open,
  onClose,
  label,
  title,
  subtitle,
  maxWidth = "sm",
  accent = DASH.wine,
  children,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  submitDisabled = false,
  hideActions = false,
  actions,
}: AppModalProps) {
  const showDefaultActions = !hideActions && (onSubmit || actions);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          ...modalPaperSx,
          borderTop: `3px solid ${accent}`,
        },
      }}
    >
      <Box sx={modalTitleSx}>
        <Box sx={{ minWidth: 0, pr: 1 }}>
          {label && (
            <Typography sx={modalLabelSx}>{label}</Typography>
          )}
          <Typography component="h2" sx={modalHeadingSx}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                fontFamily: DASH.font,
                fontSize: "0.8125rem",
                color: alpha(DASH.dark, 0.5),
                mt: 0.5,
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Close"
          size="small"
          sx={{
            color: alpha(DASH.dark, 0.45),
            border: `1px solid ${alpha(DASH.wine, 0.12)}`,
            borderRadius: 0,
            width: 32,
            height: 32,
            flexShrink: 0,
            "&:hover": { bgcolor: alpha(DASH.wine, 0.06) },
          }}
        >
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <DialogContent sx={modalContentSx}>{children}</DialogContent>

      {showDefaultActions && (
        <DialogActions sx={modalActionsSx}>
          {actions ?? (
            <>
              <Button onClick={onClose} sx={modalGhostButtonSx} disabled={isSubmitting}>
                {cancelLabel}
              </Button>
              {onSubmit && (
                <Button
                  onClick={onSubmit}
                  variant="contained"
                  disabled={isSubmitting || submitDisabled}
                  sx={modalPrimaryButtonSx}
                >
                  {isSubmitting ? "Please wait…" : submitLabel}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
