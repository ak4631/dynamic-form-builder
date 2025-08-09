<?php

namespace Optimust\Core\Api\V1\Exception;

use InvalidArgumentException;

trait EndpointExceptionTrait
{
    /**
     * @param string $message
     * @return BadRequestException
     */
    protected function getBadRequestException(
        string $message = BadRequestException::DEFAULT_ERROR_MESSAGE
    ): BadRequestException {
        return new BadRequestException($message);
    }

    /**
     * @param string $message
     * @return NotImplementedException
     */
    protected function getNotImplementedException(
        string $message = NotImplementedException::DEFAULT_ERROR_MESSAGE
    ): NotImplementedException {
        return new NotImplementedException($message);
    }

    /**
     * @param string $message
     * @return RecordNotFoundException
     */
    protected function getRecordNotFoundException(
        string $message = RecordNotFoundException::DEFAULT_ERROR_MESSAGE
    ): RecordNotFoundException {
        return new RecordNotFoundException($message);
    }

    /**
     * @param string $message
     * @return ForbiddenException
     */
    protected function getForbiddenException(
        string $message = ForbiddenException::DEFAULT_ERROR_MESSAGE
    ): ForbiddenException {
        return new ForbiddenException($message);
    }

    /**
     * @param object|null $entity
     * @param string|null $entityClass
     * @param string $message
     * @throws RecordNotFoundException
     */
    protected function throwRecordNotFoundExceptionIfNotExist(
        ?object $entity,
        ?string $entityClass = null,
        string $message = RecordNotFoundException::DEFAULT_ERROR_MESSAGE
    ) {
        if (($entityClass && !$entity instanceof $entityClass) || is_null($entity)) {
            throw $this->getRecordNotFoundException($message);
        }
    }

    /**
     * @param string $paramKey
     * @param string|null $message
     * @return InvalidParamException
     */
    protected function getInvalidParamException(string $paramKey, ?string $message = null): InvalidParamException
    {
        return new InvalidParamException([
            $paramKey => new InvalidArgumentException($message ?? "Invalid parameter `$paramKey`")
        ]);
    }
}
