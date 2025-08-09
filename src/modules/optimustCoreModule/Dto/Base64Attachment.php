<?php

namespace Optimust\Core\Dto;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class Base64Attachment
{
    private string $filename;
    private string $fileType;
    private string $size;
    private string $base64Content;

    /**
     * @param string $filename
     * @param string $fileType
     * @param string $base64Content
     * @param string $size
     */
    public function __construct(string $filename, string $fileType, string $base64Content, string $size)
    {
        $this->filename = $filename;
        $this->fileType = $fileType;
        $this->base64Content = $base64Content;
        $this->size = $size;
    }

    /**
     * @return string
     */
    public function getFilename(): string
    {
        return $this->filename;
    }

    /**
     * @param string $filename
     */
    public function setFilename(string $filename): void
    {
        $this->filename = $filename;
    }

    /**
     * @return string
     */
    public function getFileType(): string
    {
        return $this->fileType;
    }

    /**
     * @param string $fileType
     */
    public function setFileType(string $fileType): void
    {
        $this->fileType = $fileType;
    }

    /**
     * @return string
     */
    public function getSize(): string
    {
        return $this->size;
    }

    /**
     * @param string $size
     */
    public function setSize(string $size): void
    {
        $this->size = $size;
    }

    /**
     * @return string
     */
    public function getBase64Content(): string
    {
        return $this->base64Content;
    }

    /**
     * @param string $base64Content
     */
    public function setBase64Content(string $base64Content): void
    {
        $this->base64Content = $base64Content;
    }

    /**
     * @return string|null
     */
    public function getContent(): ?string
    {
        return base64_decode($this->base64Content) ?? null;
    }

    /**
     * @param UploadedFile $uploadedFile
     * @return static
     */
    public static function createFromUploadedFile(UploadedFile $uploadedFile): self
    {
        return new self(
            $uploadedFile->getClientOriginalName(),
            $uploadedFile->getClientMimeType(),
            base64_encode($uploadedFile->getContent()),
            $uploadedFile->getSize()
        );
    }

    /**
     * @param array $attachment
     * @return static
     */
    public static function createFromArray(array $attachment): self
    {
        return new self(
            $attachment['name'],
            $attachment['type'],
            $attachment['base64'],
            $attachment['size']
        );
    }
}
