import { HttpResponse, HttpRequest, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../errors/http'
import { Controller } from '../protocols/controller'
import { AddAccount } from '../../domain/usecases'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    const { name, email, password, passwordConfirmation } = httpRequest.body
    try {
      if (!name) {
        return badRequest(new MissingParamError('name'))
      }

      if (!email) {
        return badRequest(new MissingParamError('email'))
      }

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (!this.emailValidator.isValid(email)) return badRequest(new InvalidParamError('email'))

      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))
      this.addAccount.add({ name, email, password })
    } catch (error) {
      return serverError()
    }
  }
}
