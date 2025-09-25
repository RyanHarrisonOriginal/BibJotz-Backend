
import { Email } from "../shared/value-objects/Email";
import { BaseEntity } from "../BaseEntity";
import { Subscription } from "../shared/value-objects/Subscription";
import { IUserDTO } from "./user.dbt";

export class User extends BaseEntity {


  constructor(
    id: number | null,
    private email: Email,
    private username: string,
    private isPublic: boolean = true,
    private firstName: string,
    private lastName: string,
    private primaryChurchId: number | null,
    private journeySubscriptions: Subscription[],
    private guideSubscriptions: Subscription[],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) { 
    super(id ?? 0, createdAt, updatedAt);
    if (!id) {
      throw new Error('Id is required');
    }
  }

  setAccountPrivacy(isPublic: boolean) {
    this.isPublic = isPublic;
  }

  updateEmail(email: string) {
    this.email = Email.create(email);
  }

  updateUsername(username: string) {
    this.username = username;
  }

  updateFirstName(firstName: string) {
    this.firstName = firstName;
  }

  updateLastName(lastName: string) {
    this.lastName = lastName;
  }

  updateChurchId(churchId: number) {
    this.primaryChurchId = churchId;
  }

  addJourneySubscription(journeySubscription: Subscription) {
    this.journeySubscriptions.push(journeySubscription);
  }
  
  addGuideSubscription(guideSubscription: Subscription) {
    this.guideSubscriptions.push(guideSubscription);
  }

  updateProfile(profile: Partial<IUserDTO>) {
    this.email = Email.create(profile.email ?? this.email.getValue());
    this.updateUsername(profile.username ?? this.username);
    this.updateFirstName(profile.firstName ?? this.firstName);
    this.updateLastName(profile.lastName ?? this.lastName);
    this.updateChurchId(profile.primaryChurchId ?? this.primaryChurchId ?? 0);
    this.setAccountPrivacy(profile.isPublic ?? this.isPublic);
    this.touch();
  }

  getPrimaryChurchId(): number | null {
    return this.primaryChurchId;
  }

  getEmail(): Email {
    if (!this.email) {
      throw new Error('Email is not set');
    }
    return this.email;
  }

  getUsername(): string {
    if (!this.username) {
      throw new Error('Username is not set');
    }
    return this.username;
  }

  getFirstName(): string {
    if (!this.firstName) {
      throw new Error('First name is not set');
    }
    return this.firstName;
  }

  getLastName(): string {
    if (!this.lastName) {
      throw new Error('Last name is not set');
    }
    return this.lastName;
  }

  getIsPublic(): boolean {
    return this.isPublic;
  }




}
