<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Optimust\Core\Api\V1\Exception\ForbiddenException;
use Optimust\Core\Api\V1\Validator\Exceptions\ValidationEscapableException;

class InAccessibleEntityIdOption
{
    /**
     * @var bool
     */
    private bool $throw = true;

    /**
     * @var bool
     */
    private bool $throwIfOnlyEntityExist = true;

    /**
     * @var ValidationEscapableException|null
     */
    private ?ValidationEscapableException $throwable = null;

    /**
     * @var string
     */
    private string $exceptionMessage = ForbiddenException::DEFAULT_ERROR_MESSAGE;

    /**
     * @var array
     */
    private array $requiredPermissions = [];

    /**
     * @var string[]
     */
    private array $rolesToExclude = [];

    /**
     * @var string[]
     */
    private array $rolesToInclude = [];

    /**
     * @return ValidationEscapableException
     */
    public function getThrowable(): ValidationEscapableException
    {
        if (is_null($this->throwable)) {
            $this->throwable = new ForbiddenException($this->getExceptionMessage());
        }
        return $this->throwable;
    }

    /**
     * @param ValidationEscapableException $throwable
     * @return $this
     */
    public function setThrowable(ValidationEscapableException $throwable): self
    {
        $this->throwable = $throwable;
        return $this;
    }

    /**
     * @return string
     */
    public function getExceptionMessage(): string
    {
        return $this->exceptionMessage;
    }

    /**
     * @param string $exceptionMessage
     * @return $this
     */
    public function setExceptionMessage(string $exceptionMessage): self
    {
        $this->exceptionMessage = $exceptionMessage;
        return $this;
    }

    /**
     * @return bool
     */
    public function isThrow(): bool
    {
        return $this->throw;
    }

    /**
     * @param bool $throw
     * @return $this
     */
    public function setThrow(bool $throw): self
    {
        $this->throw = $throw;
        return $this;
    }

    /**
     * @return bool
     */
    public function isThrowIfOnlyEntityExist(): bool
    {
        return $this->throwIfOnlyEntityExist;
    }

    /**
     * @param bool $throwIfOnlyEntityExist
     * @return $this
     */
    public function setThrowIfOnlyEntityExist(bool $throwIfOnlyEntityExist): self
    {
        $this->throwIfOnlyEntityExist = $throwIfOnlyEntityExist;
        return $this;
    }

    /**
     * @return array
     */
    public function getRequiredPermissions(): array
    {
        return $this->requiredPermissions;
    }

    /**
     * @param array $requiredPermissions
     * @return self
     */
    public function setRequiredPermissions(array $requiredPermissions): self
    {
        $this->requiredPermissions = $requiredPermissions;
        return $this;
    }

    /**
     * @return string[]
     */
    public function getRolesToExclude(): array
    {
        return $this->rolesToExclude;
    }

    /**
     * @param string[] $rolesToExclude
     * @return self
     */
    public function setRolesToExclude(array $rolesToExclude): self
    {
        $this->rolesToExclude = $rolesToExclude;
        return $this;
    }

    /**
     * @return string[]
     */
    public function getRolesToInclude(): array
    {
        return $this->rolesToInclude;
    }

    /**
     * @param string[] $rolesToInclude
     * @return self
     */
    public function setRolesToInclude(array $rolesToInclude): self
    {
        $this->rolesToInclude = $rolesToInclude;
        return $this;
    }
}
