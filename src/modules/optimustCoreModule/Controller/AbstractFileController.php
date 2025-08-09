<?php

namespace Optimust\Core\Controller;

use Optimust\Framework\Http\BinaryFileResponse;
use Optimust\Framework\Http\Response;
use Symfony\Component\HttpFoundation\HeaderUtils;

abstract class AbstractFileController extends AbstractController
{
    /**
     * @var BinaryFileResponse|null
     */
    protected ?BinaryFileResponse $fileResponse = null;

    /**
     * @param string $file
     * @return BinaryFileResponse
     */
    protected function getNewFileResponse(string $file): BinaryFileResponse
    {
        return new BinaryFileResponse($file);
    }

    /**
     * @param string $file
     * @return BinaryFileResponse
     */
    protected function getFileResponse(string $file): BinaryFileResponse
    {
        if (!$this->fileResponse instanceof BinaryFileResponse) {
            $this->fileResponse = $this->getNewFileResponse($file);
        }
        return $this->fileResponse;
    }

    /**
     * @param string $filename
     * @return string
     */
    protected function makeAttachmentDisposition(string $filename): string
    {
        $params['filename*'] = "utf-8''" . rawurlencode($filename);
        return HeaderUtils::DISPOSITION_ATTACHMENT . '; ' . HeaderUtils::toString($params, ';');
    }

    /**
     * @param string $filename
     * @param string $contentType
     * @param string $contentLength
     * @param Response|null $response
     * @return Response
     */
    protected function setCommonHeadersToResponse(
        string $filename,
        string $contentType,
        string $contentLength,
        ?Response $response = null
    ): Response {
        if (is_null($response)) {
            $response = $this->getResponse();
        }

        $response->headers->set("Content-Type", $contentType);
        $response->headers->set("Content-Length", $contentLength);
        $response->headers->set(
            'Content-Disposition',
            $this->makeAttachmentDisposition($filename)
        );

        $response->setPublic();
        $response->setMaxAge(0);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        $response->headers->addCacheControlDirective('post-check', 0);
        $response->headers->addCacheControlDirective('pre-check', 0);
        $response->headers->set("Content-Transfer-Encoding", "binary");
        $response->headers->set('Pragma', 'Public');
        $response->headers->set('Expires', '0');

        return $response;
    }
}
