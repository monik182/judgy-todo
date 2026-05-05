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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  template: `
  <div class="danger-zone">
    <div class="danger-zone__warning">
      <p class="danger-zone__description">These actions are irreversible. Use with caution.</p>
    </div>
    <div class="danger-zone__actions">
      <div class="danger-zone__action">
        <div>
          <p class="danger-zone__action-title">Clear all todos</p>
          <p class="danger-zone__action-desc">Permanently delete every todo item.</p>
        </div>
        <button matButton="filled" class="danger-btn" (click)="openDialog()">Clear All</button>
      </div>
      <div class="danger-zone__action">
        <div>
          <p class="danger-zone__action-title">Reset todos</p>
          <p class="danger-zone__action-desc">Restore the default sample todos.</p>
        </div>
        <button matButton="outlined" class="danger-btn-outline" (click)="resetAllOutput.emit()">Reset</button>
      </div>
    </div>
  </div>
  `,
  styles: `
    .danger-zone {
      padding: 8px 4px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .danger-zone__description {
      font-size: 13px;
      color: #888;
      margin: 0;
    }

    .danger-zone__actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .danger-zone__action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      border: 1px solid rgba(211, 47, 47, 0.15);
    }

    .danger-zone__action-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin: 0 0 2px 0;
    }

    .danger-zone__action-desc {
      font-size: 12px;
      color: #888;
      margin: 0;
    }

    .danger-btn {
      flex-shrink: 0;
      --mdc-filled-button-container-color: #d32f2f;
    }

    .danger-btn-outline {
      flex-shrink: 0;
      --mdc-outlined-button-label-text-color: #d32f2f;
      --mdc-outlined-button-outline-color: #d32f2f;
    }
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
  selector: 'app-confirmation-dialog',
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
