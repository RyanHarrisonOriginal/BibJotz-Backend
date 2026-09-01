export class TaggedReference {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly author: string | null,
    readonly typeId: number,
    readonly typeName: string,
  ) {}

  static fromReference(reference: {
    getId(): number | null;
    getTitle(): string;
    getAuthor(): string | null;
    getTypeId(): number;
    getTypeName(): string;
  }): TaggedReference {
    return new TaggedReference(
      reference.getId() ?? 0,
      reference.getTitle(),
      reference.getAuthor(),
      reference.getTypeId(),
      reference.getTypeName(),
    );
  }
}
