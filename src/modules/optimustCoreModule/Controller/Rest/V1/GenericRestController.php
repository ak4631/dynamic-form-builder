<?php

namespace Optimust\Core\Controller\Rest\V1;

use Exception;
use Optimust\Core\Api\V1\CollectionEndpoint;
use Optimust\Core\Api\V1\Endpoint;
use Optimust\Core\Api\V1\Exception\NotImplementedException;
use Optimust\Core\Api\V1\Request;
use Optimust\Core\Api\V1\ResourceEndpoint;
use Optimust\Core\Api\V1\Response;
use Optimust\Core\Api\V1\Serializer\AbstractEndpointResult;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;

class GenericRestController extends AbstractRestController
{
    /**
     * @var null|Endpoint
     */
    protected ?Endpoint $apiEndpoint = null;

    /**
     * @inheritDoc
     * @throws Exception
     */
    protected function init(Request $request)
    {
        $apiEndpoint = $request->getAttributes()->get('_api');
        if (is_null($apiEndpoint)) {
            throw new Exception(
                sprintf(
                    'Please define `_api` attribute under `defaults` in `%s` within particular routes.yaml',
                    $request->getHttpRequest()->getPathInfo()
                )
            );
        }
        if (!class_exists($apiEndpoint)) {
            throw new Exception(
                sprintf('Could not found class `%s`. Hint: use fully qualified class name', $apiEndpoint)
            );
        }

        $this->apiEndpoint = new $apiEndpoint($request);

        if (!$this->apiEndpoint instanceof ResourceEndpoint && !$this->apiEndpoint instanceof CollectionEndpoint) {
            throw $this->getNotInstanceOfException(
                ResourceEndpoint::class . '` or `' . CollectionEndpoint::class
            );
        }
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    protected function handleGetRequest(Request $request): Response
    {
        if (!$this->isGetOneRequest($request)) {
            if ($this->apiEndpoint instanceof CollectionEndpoint) {
                $result = $this->apiEndpoint->getAll();
            } else {
                throw $this->getNotInstanceOfException(CollectionEndpoint::class);
            }
        } else {
            if ($this->apiEndpoint instanceof ResourceEndpoint) {
                $result = $this->apiEndpoint->getOne();
            } else {
                throw $this->getNotInstanceOfException(ResourceEndpoint::class);
            }
        }
        return new Response(...$this->getPreparedResponseParamsFromResult($result));
    }

    /**
     * @inheritDoc
     */
    protected function initGetValidationRule(Request $request): ?ParamRuleCollection
    {
        $this->getValidationRule = $this->isGetOneRequest($request) ?
            ($this->apiEndpoint instanceof ResourceEndpoint ?
                $this->apiEndpoint->getValidationRuleForGetOne() :
                null) :
            ($this->apiEndpoint instanceof CollectionEndpoint ?
                $this->apiEndpoint->getValidationRuleForGetAll() :
                null);
        return $this->getValidationRule;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    protected function handlePostRequest(Request $request): Response
    {
        if ($this->apiEndpoint instanceof CollectionEndpoint) {
            $result = $this->apiEndpoint->create();
            return new Response(...$this->getPreparedResponseParamsFromResult($result));
        } else {
            throw $this->getNotInstanceOfException(CollectionEndpoint::class);
        }
    }

    /**
     * @inheritDoc
     */
    protected function initPostValidationRule(Request $request): ?ParamRuleCollection
    {
        $this->postValidationRule = $this->apiEndpoint instanceof CollectionEndpoint ?
            $this->apiEndpoint->getValidationRuleForCreate() : null;
        return $this->postValidationRule;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    protected function handlePutRequest(Request $request): Response
    {
        if ($this->apiEndpoint instanceof ResourceEndpoint) {
            $result = $this->apiEndpoint->update();
            return new Response(...$this->getPreparedResponseParamsFromResult($result));
        } else {
            throw $this->getNotInstanceOfException(ResourceEndpoint::class);
        }
    }

    /**
     * @inheritDoc
     */
    protected function initPutValidationRule(Request $request): ?ParamRuleCollection
    {
        $this->putValidationRule = $this->apiEndpoint instanceof ResourceEndpoint ?
            $this->apiEndpoint->getValidationRuleForUpdate() : null;
        return $this->putValidationRule;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    protected function handleDeleteRequest(Request $request): Response
    {
        if ($this->apiEndpoint instanceof CollectionEndpoint || $this->apiEndpoint instanceof ResourceEndpoint) {
            $result = $this->apiEndpoint->delete();
            return new Response(...$this->getPreparedResponseParamsFromResult($result));
        } else {
            throw $this->getNotInstanceOfException(ResourceEndpoint::class . '` or `' . CollectionEndpoint::class);
        }
    }

    /**
     * @inheritDoc
     */
    protected function initDeleteValidationRule(Request $request): ?ParamRuleCollection
    {
        $this->deleteValidationRule = $this->apiEndpoint instanceof CollectionEndpoint ?
            $this->apiEndpoint->getValidationRuleForDelete() : null;
        return $this->deleteValidationRule;
    }

    /**
     * @param string $class
     * @return Exception
     */
    private function getNotInstanceOfException(string $class): Exception
    {
        return new NotImplementedException(
            sprintf('`%s` Endpoint is not an instance of `%s`', get_class($this->apiEndpoint), $class)
        );
    }

    /**
     * @param Request $request
     * @return bool
     */
    private function isGetOneRequest(Request $request): bool
    {
        $idAttribute = $request->getAttributes()->get('_key', 'id');
        return $request->getAttributes()->has($idAttribute) || $request->getQuery()->has($idAttribute);
    }

    /**
     * @param AbstractEndpointResult $result
     * @return array
     */
    private function getPreparedResponseParamsFromResult(AbstractEndpointResult $result): array
    {
        $meta = $result->getMeta();
        $rels = $result->getRels();
        return [
            $result->normalize(),
            is_null($meta) ? [] : $meta->all(),
            is_null($rels) ? [] : $rels->all()
        ];
    }
}
