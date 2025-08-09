<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Optimust\Core\Traits\Service\ConfigServiceTrait;
use Optimust\Core\Traits\Service\TextHelperTrait;

class Base64Attachment extends AbstractRule
{
    use ConfigServiceTrait;
    use TextHelperTrait;

    /**
     * @var array
     */
    protected array $allowedTypes;
    /**
     * @var array
     */
    protected array $allowedExtensions;
    /**
     * @var int|null
     */
    protected ?int $fileNameMaxLength;
    /**
     * @var int|null
     */
    protected ?int $fileNameMinLength;
    /**
     * @var int
     */
    protected int $maxFileSize;
    /**
     * @var bool
     */
    private bool $checkSizeStrictly;

    public function __construct(
        ?array $allowedTypes = null,
        ?array $allowedExtensions = null,
        ?int $fileNameMaxLength = null,
        ?int $fileNameMinLength = null,
        bool $checkSizeStrictly = true,
        ?int $maxFileSize = null
    ) {
        $this->allowedTypes = $allowedTypes ?? $this->getConfigService()->getAllowedFileTypes();
        $this->allowedExtensions = $allowedExtensions ?? $this->getConfigService()->getAllowedFileExtensions();
        $this->fileNameMaxLength = $fileNameMaxLength;
        $this->fileNameMinLength = $fileNameMinLength;
        $this->checkSizeStrictly = $checkSizeStrictly;
        $this->maxFileSize = $maxFileSize ?? $this->getConfigService()->getMaxAttachmentSize();
    }

    public function validate($input): bool
    {
        if (!(isset($input['name']) && isset($input['type']) && isset($input['base64']) && isset($input['size']))) {
            return false;
        }
        if (!in_array($input['type'], $this->allowedTypes)) {
            return false;
        }

        $fileExtension = pathinfo($input['name'])['extension'] ?? null;
        if (is_null($fileExtension) || !in_array(strtolower($fileExtension), $this->allowedExtensions)) {
            return false;
        }

        if (!is_null($this->fileNameMinLength) || !is_null($this->fileNameMaxLength)) {
            if (is_string($input['name'])) {
                $fileNameLength = $this->getTextHelper()->strLength($input['name']);
                if (!($this->validateMin($fileNameLength) && $this->validateMax($fileNameLength))) {
                    return false;
                }
            } else {
                return false;
            }
        }

        $size = intval($input['size']);
        if ($this->checkSizeStrictly) {
            $content = base64_decode($input['base64']);
            $contentSize = $this->getTextHelper()->strLength($content, '8bit');
            $content = null;
            if ($size !== $contentSize) {
                return false;
            }
        }

        if ($size > $this->maxFileSize) {
            return false;
        }

        return true;
    }

    /**
     * @param int $length
     * @return bool
     */
    private function validateMin(int $length): bool
    {
        if ($this->fileNameMinLength === null) {
            return true;
        }

        return $length >= $this->fileNameMinLength;
    }

    /**
     * @param int $length
     * @return bool
     */
    private function validateMax(int $length): bool
    {
        if ($this->fileNameMaxLength === null) {
            return true;
        }

        return $length <= $this->fileNameMaxLength;
    }
}
