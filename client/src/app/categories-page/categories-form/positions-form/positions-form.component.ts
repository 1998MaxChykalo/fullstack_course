import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from '../../../shared/services/positions.service';
import { MaterialService, MaterialInstance } from '../../../shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '../../../../../node_modules/@angular/forms';
import { Position } from '../../../shared/interfaces/Position';
import { Message } from '../../../shared/interfaces/Message';
@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  form: FormGroup;
  positionId = null;
  isLoading: boolean = false;
  positions: Position[] = [];
  modal: MaterialInstance;
  
  constructor(private positionsService: PositionsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required ),
      cost: new FormControl(null, [ Validators.required, Validators.min(1)])
    })
    this.form.enable();
    this.isLoading = true;
    this.positionsService.fetch(this.categoryId)
      .subscribe(
        (positions: Position[]) => {
        this.positions = positions;
          this.isLoading = false;
        }
      );
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  ngOnDestroy(): void {
    this.modal.destroy();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue(position);
    MaterialService.updateTextInputs();
    this.modal.open();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
  }
  onCancel() {
    this.modal.close();
  }
  onSubmit() {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    function onComplete() {
      this.modal.close();
      this.form.enable();
      this.form.reset();
    }
    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition)
        .subscribe(
          (pos: Position) => {
            MaterialService.toast("POSITION_WAS_UPDATED");
            const updatedPositionIndex = this.positions.findIndex(position => position._id == pos._id);
            this.positions[updatedPositionIndex] = pos;
            this.form.enable();
          },
          error => {
            MaterialService.toast(error.error.message);
          },
          onComplete.bind(this)
        );
    } else {
      this.positionsService.create(newPosition)
        .subscribe(
          (pos: Position) => {
            MaterialService.toast("POSITION_WAS_ADDED");
            this.positions.push(pos);
            this.form.enable();
          },
          error => {
            MaterialService.toast(error.error.message);
          },
          onComplete.bind(this)
      );
    }
  }
  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`DO_YOU_REALLY_WANT_TO_DELETE_POSITION : ${position.name}?`);

    if (decision) {
      this.positionsService.delete(position)
        .subscribe(
          (res: Message) => {
            const deletedPositionIndex = this.positions.findIndex(pos => pos._id === position._id);
            this.positions.splice(deletedPositionIndex, 1);
            MaterialService.toast(res.message);
          },
          error => MaterialService.toast(error.error.message)
        )
    }
  }
}
