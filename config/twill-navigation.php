<?php

return [
    'collection' => [
        'title' => 'Collection',
        'route' => 'admin.collection.products.index',
        'primary_navigation' => [
            'products' => [
                'title' => 'Objets',
                'module' => true,
            ],
            'authors' => [
                'title' => 'Auteurs',
                'module' => true,
            ],
        ],
    ],
    'encyclopedie' => [
        'title' => 'Encyclopédie',
        'route' => 'admin.encyclopedie.articles.index',
        'primary_navigation' => [

            'articles' => [
                'title' => 'Articles',
                'module' => true,
            ],
            'sections' => [
                'title' => 'Rubriques',
                'module' => true,
            ],
        ],

    ],
    // 'pages' => [
    //     'title' => 'Pages',
    //     'module' => true,
    // ],
];
