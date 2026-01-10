export class HttpStatus {
  private constructor(
    public readonly code: number,
    public readonly message: string
  ) {}

  static readonly OK = new HttpStatus(200, "OK");
  static readonly CREATED = new HttpStatus(201, "Created");
  static readonly BAD_REQUEST = new HttpStatus(400, "Bad Request");
  static readonly UNAUTHORIZED = new HttpStatus(401, "Unauthorized");
  static readonly FORBIDDEN = new HttpStatus(403, "Forbidden");
  static readonly NOT_FOUND = new HttpStatus(404, "Not Found");
  static readonly INTERNAL_SERVER_ERROR = new HttpStatus(
    500,
    "Internal Server Error"
  );
  static readonly UNPROCESSABLE_ENTITY = new HttpStatus(
    422,
    "Unprocessable Entity"
  );
  static fromCode(code: number): HttpStatus | undefined {
    return Object.values(HttpStatus).find(
      (s) => s instanceof HttpStatus && s.code === code
    ) as HttpStatus | undefined;
  }

  toString() {
    return `${this.code} ${this.message}`;
  }
}
