import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-danger-zone',
  imports: [MatButtonModule],
  template: `
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <h2>Danger Zone</h2>
    <p>These actions are irreversible. Use with caution.</p>
    <button matButton="filled" (click)="openDialog()">Clear All Todos</button>
    <button matButton="outlined" (click)="resetAllOutput.emit()">Reset Todos</button>
  </div>
  `
})
export class DangerZoneComponent {
  clearAllOutput = output<void>();
  resetAllOutput = output<void>();
  readonly dialog = inject(MatDialog);

  clearAll() {
    this.clearAllOutput.emit();
    this.dialog.closeAll();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result) {
        this.clearAll();
      }
    });
  }
}

@Component({
  selector: 'confirmation-dialog',
  template: `
  <h2 mat-dialog-title>Are you sure?</h2>
  <mat-dialog-content>Are you sure you want to clear all todos? This action cannot be undone.</mat-dialog-content>
  <mat-dialog-actions>
    <button matButton mat-dialog-close>Cancel</button>
    <button matButton="filled" color="warn" (click)="clearAll()">Clear All</button>
  </mat-dialog-actions>
  `,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialog>);

  clearAll() {
    this.dialogRef.close(true);
  }
}
