<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'app_default')]
    public function index(): Response
    {
        return $this->render('default/index.html.twig', [
            
        ]);
    }

    #[Route('/api/word', name: 'word')]
    public function checkWord(Request $request): JsonResponse
    {

        $input = json_decode($request->getContent())->data;
        $word = ['K', 'N', 'O', 'C', 'K'];
        $output = [];

        // for loop to check if letters are in exact same positions, if they're replace them with null so they won't be used further
        for ($i = 0; $i < 5; $i++) {
            if ($input[$i] === $word[$i]) {
                $output[$i] = ['color' => 'green'];
                $word[$i] = null;
                $input[$i] = null;
            }
        }


        for ($j = 0; $j < 5; $j++) {
            if ($input[$j] === null) {
                continue;
            }
            for ($k = 0; $k < 5; $k++) {
                if ($input[$j] === $word[$k]) {
                    $output[$j] = ['color' => 'yellow'];
                    $input[$j] = null;
                    $word[$k] = null;
                    break;
                }
                if ($k === 4) {
                    $output[$j] = ['color' => 'grey'];
                }
            }
        }

        ksort($output);

        
        

        $response = new JsonResponse();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($output));


        return $response;

    }
}
