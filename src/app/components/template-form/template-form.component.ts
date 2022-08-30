import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Template } from 'src/app/common/models/Template';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  templateForm = this.fb.group({
    templates: this.fb.array([])
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  newTemplate(): FormGroup {
    return this.fb.group({
      templateName: [''],
      items: this.fb.array([])
    })
  }

  newItem(): FormGroup {
    return this.fb.group({
      itemName: [''],
      units : this.fb.array([])
    })
  }

  newUnit(): FormGroup{
    return this.fb.group({
      unit: [''],
      type: ['']
    })
  }

  templates(): FormArray {
    return this.templateForm.get('templates') as FormArray;
  }

  items(tempIdx: number): FormArray {
    return this.templates().at(tempIdx).get('items') as FormArray;
  }

  units(tempIdx: number, itemIdx: number): FormArray {
    return this.items(tempIdx).at(itemIdx).get('units') as FormArray;
  }

  addTemplateForm(){
    this.templates().push(this.newTemplate());
  }

  removeTemplateForm(tempIdx: number){
    this.templates().removeAt(tempIdx);
  }

  addTemplateItem(tempIdx: number) {
    this.items(tempIdx).push(this.newItem());
  }

  removeTemplateItem(tempIdx: number, itemIdx: number){
    this.items(tempIdx).removeAt(itemIdx);
  }

  addUnit(tempIdx: number, itemIdx: number){
    this.units(tempIdx, itemIdx).push(this.newUnit());
  }

  removeUnit(tempIdx: number, itemIdx: number, unitIdx: number){
    this.units(tempIdx, itemIdx).removeAt(unitIdx);
  }

  onSubmit(){
    console.log(this.templateForm.value);
  }
}
