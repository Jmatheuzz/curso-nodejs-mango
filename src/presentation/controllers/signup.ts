import { HttpResponse, HttpRequest, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { badRequest, serverError } from '../errors/http'
import { Controller } from '../protocols/controller'
export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      if (!httpRequest.body.name) {
        return badRequest(new MissingParamError('name'))
      }
      if (!httpRequest.body.email) {
        return badRequest(new MissingParamError('email'))
      }

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) return badRequest(new InvalidParamError('email'))
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
