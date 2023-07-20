export class BaseResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;

  constructor(props) {
    this.statusCode = props.statusCode;
    this.message = props.message;
    this.data = props.data;
  }

  static created<T>(data: T, message?: string) {
    return new BaseResponse<T>({
      statusCode: 201,
      message,
      data,
    });
  }

  static success<T>(data?: T) {
    return new BaseResponse<T>({
      statusCode: 200,
      data,
    });
  }

  static fail(statusCode: number, message: string) {
    return new BaseResponse({
      statusCode,
      message,
    });
  }
}
