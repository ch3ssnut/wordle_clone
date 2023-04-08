<?php

namespace App\Controller;

use App\Entity\Words;
use App\Service\AllWords;
use Doctrine\ORM\EntityManagerInterface;
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
    public function checkWord(Request $request, EntityManagerInterface $entityManagerInterface, AllWords $allWords): JsonResponse
    {


        $input = json_decode($request->getContent())->data;

        // get current word 
        $repository = $entityManagerInterface->getRepository(Words::class);
        $wordRep = $repository->findOneBy(
            ['currentWord' => true]
        );
       

        // if word is not present in database send empty response
        if (!in_array(strtolower(implode('', $input)), $allWords->getAllWords()))
        {
            $response = new JsonResponse();

            $response->headers->set('Content-Type', 'application/json');
            $response->headers->set('Access-Control-Allow-Origin', '*');

            return $response;
        }
        $word = str_split(strtoupper($wordRep->getName()));
        $output = [];


        // for loop to check if letters are in exact same positions, if they're replace them with null so they won't be used further
        for ($i = 0; $i < 5; $i++) {
            if ($input[$i] === $word[$i]) {
                $output[$i] = ['color' => 'green'];
                $word[$i] = null;
                $input[$i] = null;
            }
        }

        // checking if letter is present but not on the right position
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
        // sort array so it'll be in order
        ksort($output);

        
        
        // send JSON response to frontend
        $response = new JsonResponse();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($output));


        return $response;

    }
}
