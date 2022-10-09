import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../errors/http'
export class SignUpController {
  handle (httRequest: HttpRequest): HttpResponse {
    if (!httRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!httRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
