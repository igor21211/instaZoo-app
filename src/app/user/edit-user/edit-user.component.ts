import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification.service";
import {UserService} from "../../service/user.service";
import {User} from "../../models/User";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit{
  //@ts-ignore
  public profileEditFrom: FormGroup;

  constructor(private dialogRef: MatDialogRef<EditUserComponent>,
              private fb: FormBuilder,
              private notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService) {
  }



  ngOnInit(): void {
    this.profileEditFrom = this.createProfileForm();
  }

  createProfileForm(): FormGroup{
    return this.fb.group({
      firstname:[
        this.data.user.firstname,
        Validators.compose([Validators.required])
      ],
      lastname:[
        this.data.user.lastname,
        Validators.compose([Validators.required])
      ],
      bio:[
        this.data.user.bio,
        Validators.compose([Validators.required])
      ]
    });
  }

  submit(): void{
    this.userService.updateUser(this.updateUser())
      .subscribe(()=>{
        this.notificationService.showSnackBar('User update successfully')
        this.dialogRef.close();
      });
  }

  private updateUser(): User{
    this.data.user.firstname = this.profileEditFrom.value.firstname;
    this.data.user.lastname = this.profileEditFrom.value.lastname;
    this.data.user.bio = this.profileEditFrom.value.bio;
    return this.data.user
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
