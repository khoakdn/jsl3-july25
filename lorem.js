(function(exports){
	'use strict';
	const clientSide=exports==undefined;
	
	const latin=[
		"lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "ut", "aliquam", "purus", "sit", "amet", "luctus", "venenatis", "lectus", "magna", 
		"fringilla", "urna", "porttitor", "rhoncus", "dolor", "purus", "non", "enim", "praesent", "elementum", "facilisis", "leo", "vel", "fringilla", "est", "ullamcorper", 
		"eget", "nulla", "facilisi", "etiam", "dignissim", "diam", "quis", "enim", "lobortis", "scelerisque", "fermentum", "dui", "faucibus", "in", "ornare", "quam", "viverra", 
		"orci", "sagittis", "eu", "volutpat", "odio", "facilisis", "mauris", "sit", "amet", "massa", "vitae", "tortor", "condimentum", "lacinia", "quis", "vel", "eros", "donec", 
		"ac", "odio", "tempor", "orci", "dapibus", "ultrices", "in", "iaculis", "nunc", "sed", "augue", "lacus", "viverra", "vitae", "congue", "eu", "consequat", "ac", "felis", 
		"donec", "et", "odio", "pellentesque", "diam", "volutpat", "commodo", "sed", "egestas", "egestas", "fringilla", "phasellus", "faucibus", "scelerisque", "eleifend", "donec", 
		"pretium", "vulputate", "sapien", "nec", "sagittis", "aliquam", "malesuada", "bibendum", "arcu", "vitae", "elementum", "curabitur", "vitae", "nunc", "sed", "velit", 
		"dignissim", "sodales", "ut", "eu", "sem", "integer", "vitae", "justo", "eget", "magna", "fermentum", "iaculis", "eu", "non", "diam", "phasellus", "vestibulum", "lorem", 
		"sed", "risus", "ultricies", "tristique", "nulla", "aliquet", "enim", "tortor", "at", "auctor", "urna", "nunc", "id", "cursus", "metus", "aliquam", "eleifend", "mi", "in",
		"nulla", "posuere", "sollicitudin", "aliquam", "ultrices", "sagittis", "orci", "a", "scelerisque", "purus", "semper", "eget", "duis", "at", "tellus", "at", "urna",
		"condimentum", "mattis", "pellentesque", "id", "nibh", "tortor", "id", "aliquet", "lectus", "proin", "nibh", "nisl", "condimentum", "id", "venenatis", "a", "condimentum",
		"vitae", "sapien", "pellentesque", "habitant", "morbi", "tristique", "senectus", "et", "netus", "et", "malesuada", "fames", "ac", "turpis", "egestas", "sed", "tempus",
		"urna", "et", "pharetra", "pharetra", "massa", "massa", "ultricies", "mi", "quis", "hendrerit", "dolor", "magna", "eget", "est", "lorem", "ipsum", "dolor", "sit", "amet",
		"consectetur", "adipiscing", "elit", "pellentesque", "habitant", "morbi", "tristique", "senectus", "et", "netus", "et", "malesuada", "fames", "ac", "turpis", "egestas",
		"integer", "eget", "aliquet", "nibh", "praesent", "tristique", "magna", "sit", "amet", "purus", "gravida", "quis", "blandit", "turpis", "cursus", "in", "hac", "habitasse",
		"platea", "dictumst", "quisque", "sagittis", "purus", "sit", "amet", "volutpat", "consequat", "mauris", "nunc", "congue", "nisi", "vitae", "suscipit", "tellus", "mauris",
		"a", "diam", "maecenas", "sed", "enim", "ut", "sem", "viverra", "aliquet", "eget", "sit", "amet", "tellus", "cras", "adipiscing", "enim", "eu", "turpis", "egestas", "pretium",
		"aenean", "pharetra", "magna", "ac", "placerat", "vestibulum", "lectus", "mauris", "ultrices", "eros", "in", "cursus", "turpis", "massa", "tincidunt", "dui", "ut",
		"ornare", "lectus", "sit", "amet", "est", "placerat", "in", "egestas", "erat", "imperdiet", "sed", "euismod", "nisi", "porta", "lorem", "mollis", "aliquam", "ut", "porttitor",
		"leo", "a", "diam", "sollicitudin", "tempor", "id", "eu", "nisl", "nunc", "mi", "ipsum", "faucibus", "vitae", "aliquet", "nec", "ullamcorper", "sit", "amet", "risus",
		"nullam", "eget", "felis", "eget", "nunc", "lobortis", "mattis", "aliquam", "faucibus", "purus", "in", "massa", "tempor", "nec", "feugiat", "nisl", "pretium", "fusce", "id",
		"velit", "ut", "tortor", "pretium", "viverra", "suspendisse", "potenti", "nullam", "ac", "tortor", "vitae", "purus", "faucibus", "ornare", "suspendisse", "sed", "nisi",
		"lacus", "sed", "viverra", "tellus", "in", "hac", "habitasse", "platea", "dictumst", "vestibulum", "rhoncus", "est", "pellentesque", "elit", "ullamcorper", "dignissim",
		"cras", "tincidunt", "lobortis", "feugiat", "vivamus", "at", "augue", "eget", "arcu", "dictum", "varius", "duis", "at", "consectetur", "lorem", "donec", "massa", "sapien",
		"faucibus", "et", "molestie", "ac", "feugiat", "sed", "lectus", "vestibulum", "mattis", "ullamcorper", "velit", "sed", "ullamcorper", "morbi", "tincidunt", "ornare",
		"massa", "eget", "egestas", "purus", "viverra", "accumsan", "in", "nisl", "nisi", "scelerisque", "eu", "ultrices", "vitae", "auctor", "eu", "augue", "ut", "lectus",
		"arcu", "bibendum", "at", "varius", "vel", "pharetra", "vel", "turpis", "nunc", "eget", "lorem", "dolor", "sed", "viverra", "ipsum", "nunc", "aliquet", "bibendum", "enim",
		"facilisis", "gravida", "neque", "convallis", "a", "cras", "semper", "auctor", "neque", "vitae", "tempus", "quam", "pellentesque", "nec", "nam", "aliquam", "sem", "et",
		"tortor", "consequat", "id", "porta", "nibh", "venenatis", "cras", "sed", "felis", "eget", "velit", "aliquet", "sagittis", "id", "consectetur", "purus", "ut", "faucibus",
		"pulvinar", "elementum", "integer", "enim", "neque", "volutpat", "ac", "tincidunt", "vitae", "semper", "quis", "lectus", "nulla", "at", "volutpat", "diam", "ut",
		"venenatis", "tellus", "in", "metus", "vulputate", "eu", "scelerisque", "felis", "imperdiet", "proin", "fermentum", "leo", "vel", "orci", "porta", "non", "pulvinar", "neque",
		"laoreet", "suspendisse", "interdum", "consectetur", "libero", "id", "faucibus", "nisl", "tincidunt", "eget", "nullam", "non", "nisi", "est", "sit", "amet", "facilisis", 
		"magna", "etiam", "tempor", "orci", "eu", "lobortis", "elementum", "nibh", "tellus", "molestie", "nunc", "non", "blandit", "massa", "enim", "nec", "dui", "nunc", "mattis",
		"enim", "ut", "tellus", "elementum", "sagittis", "vitae", "et", "leo", "duis", "ut", "diam", "quam", "nulla", "porttitor", "massa", "id", "neque", "aliquam", "vestibulum",
		"morbi", "blandit", "cursus", "risus", "at", "ultrices", "mi", "tempus", "imperdiet", "nulla", "malesuada", "pellentesque", "elit", "eget", "gravida", "cum", "sociis",
		"natoque", "penatibus", "et", "magnis", "dis", "parturient", "montes", "nascetur", "ridiculus", "mus", "mauris", "vitae", "ultricies", "leo", "integer", "malesuada",
		"nunc", "vel", "risus", "commodo", "viverra", "maecenas", "accumsan", "lacus", "vel", "facilisis", "volutpat", "est", "velit", "egestas", "dui", "id", "ornare", "arcu",
		"odio", "ut", "sem", "nulla", "pharetra", "diam", "sit", "amet", "nisl", "suscipit", "adipiscing", "bibendum", "est", "ultricies", "integer", "quis", "auctor", "elit",
		"sed", "vulputate", "mi", "sit", "amet", "mauris", "commodo", "quis", "imperdiet", "massa", "tincidunt", "nunc", "pulvinar", "sapien", "et", "ligula", "ullamcorper",
		"malesuada", "proin", "libero", "nunc", "consequat", "interdum", "varius", "sit", "amet", "mattis", "vulputate", "enim", "nulla", "aliquet", "porttitor", "lacus",
		"luctus", "accumsan", "tortor", "posuere", "ac", "ut", "consequat", "semper", "viverra", "nam", "libero", "justo", "laoreet", "sit", "amet", "cursus", "sit", "amet",
		"dictum", "sit", "amet", "justo", "donec", "enim", "diam", "vulputate", "ut", "pharetra", "sit", "amet", "aliquam", "id", "diam", "maecenas", "ultricies", "mi", "eget",
		"mauris", "pharetra", "et", "ultrices", "neque", "ornare", "aenean", "euismod", "elementum", "nisi", "quis", "eleifend", "quam", "adipiscing", "vitae", "proin", "sagittis",
		"nisl", "rhoncus", "mattis", "rhoncus", "urna", "neque", "viverra", "justo", "nec", "ultrices", "dui", "sapien", "eget", "mi", "proin", "sed", "libero", "enim", "sed",
		"faucibus", "turpis", "in", "eu", "mi", "bibendum", "neque", "egestas", "congue", "quisque", "egestas", "diam", "in", "arcu", "cursus", "euismod", "quis", "viverra", "nibh",
		"cras", "pulvinar", "mattis", "nunc", "sed", "blandit", "libero", "volutpat", "sed", "cras", "ornare", "arcu", "dui", "vivamus", "arcu", "felis", "bibendum", "ut",
		"tristique", "et", "egestas", "quis", "ipsum", "suspendisse", "ultrices", "gravida", "dictum", "fusce", "ut", "placerat", "orci", "nulla", "pellentesque", "dignissim",
		"enim", "sit", "amet", "venenatis", "urna", "cursus", "eget", "nunc", "scelerisque", "viverra", "mauris", "in", "aliquam", "sem", "fringilla", "ut", "morbi", "tincidunt",
		"augue", "interdum", "velit", "euismod", "in", "pellentesque", "massa", "placerat", "duis", "ultricies", "lacus", "sed", "turpis", "tincidunt", "id", "aliquet", "risus",
		"feugiat", "in", "ante", "metus", "dictum", "at", "tempor", "commodo", "ullamcorper", "a", "lacus", "vestibulum", "sed", "arcu", "non", "odio", "euismod", "lacinia", "at",
		"quis", "risus", "sed", "vulputate", "odio", "ut", "enim", "blandit", "volutpat", "maecenas", "volutpat", "blandit", "aliquam", "etiam", "erat", "velit", "scelerisque",
		"in", "dictum", "non", "consectetur", "a", "erat", "nam", "at", "lectus", "urna", "duis", "convallis", "convallis", "tellus", "id", "interdum", "velit", "laoreet", "id",
		"donec", "ultrices", "tincidunt", "arcu", "non", "sodales", "neque", "sodales", "ut", "etiam", "sit", "amet", "nisl", "purus", "in", "mollis", "nunc", "sed", "id", 
		"semper", "risus", "in", "hendrerit", "gravida", "rutrum", "quisque", "non", "tellus", "orci", "ac", "auctor", "augue", "mauris", "augue", "neque", "gravida", "in", 
		"fermentum", "et", "sollicitudin", "ac", "orci", "phasellus", "egestas", "tellus", "rutrum", "tellus", "pellentesque", "eu", "tincidunt", "tortor", "aliquam", "nulla", 
		"facilisi", "cras", "fermentum", "odio", "eu", "feugiat", "pretium", "nibh", "ipsum", "consequat", "nisl", "vel", "pretium", "lectus", "quam", "id", "leo", "in", "vitae",
		"turpis", "massa", "sed", "elementum", "tempus", "egestas", "sed", "sed", "risus", "pretium", "quam", "vulputate", "dignissim", "suspendisse", "in", "est", "ante", "in",
		"nibh", "mauris", "cursus", "mattis", "molestie", "a", "iaculis", "at", "erat", "pellentesque", "adipiscing", "commodo", "elit", "at", "imperdiet", "dui", "accumsan",
		"sit", "amet", "nulla", "facilisi", "morbi", "tempus", "iaculis", "urna", "id", "volutpat", "lacus", "laoreet", "non", "curabitur", "gravida", "arcu", "ac", "tortor", 
		"dignissim", "convallis", "aenean", "et", "tortor", "at", "risus", "viverra", "adipiscing", "at", "in", "tellus", "integer", "feugiat", "scelerisque", "varius", "morbi", 
		"enim", "nunc", "faucibus", "a", "pellentesque", "sit", "amet", "porttitor", "eget", "dolor", "morbi", "non", "arcu", "risus", "quis", "varius", "quam", "quisque", "id",
		"diam", "vel", "quam", "elementum", "pulvinar", "etiam", "non", "quam", "lacus", "suspendisse", "faucibus", "interdum", "posuere", "lorem", "ipsum", "dolor", "sit", "amet",
		"consectetur", "adipiscing", "elit", "duis", "tristique", "sollicitudin", "nibh", "sit", "amet", "commodo", "nulla", "facilisi","nullam", "vehicula", "ipsum", "a", "arcu",
		"cursus", "vitae", "congue", "mauris", "rhoncus", "aenean", "vel", "elit", "scelerisque", "mauris", "pellentesque", "pulvinar", "pellentesque", "habitant", "morbi",
		"tristique", "senectus", "et", "netus", "et", "malesuada", "fames", "ac", "turpis", "egestas", "maecenas", "pharetra", "convallis", "posuere", "morbi", "leo", "urna",
		"molestie", "at", "elementum", "eu", "facilisis", "sed", "odio", "morbi", "quis", "commodo", "odio", "aenean", "sed", "adipiscing", "diam", "donec", "adipiscing",
		"tristique", "risus", "nec", "feugiat", "in", "fermentum", "posuere", "urna", "nec", "tincidunt", "praesent", "semper", "feugiat", "nibh", "sed", "pulvinar", "proin",
		"gravida", "hendrerit", "lectus", "a", "molestie"
	];
	
	const greek=[
		"aπό","την","φαντασίαν","έως","εις","το","xαρτί","eίναι","δύσκολον","πέρασμα","είναι","επικίνδυνος","θάλασσα","h","απόστασις","φαίνεται","μικρά","κατά","πρώτην","όψιν","και","εν",
		"τοσούτω","πόσον","μακρόν","ταξίδι","είναι","και","πόσον","επιζήμιον","ενίοτε","δια","τα","πλοία","τα","οποία","το","επιχειρούνh","πρώτη","ζημία","προέρχεται","εκ","της","λίαν",
		"ευθραύστου","φύσεως","των","εμπορευμάτων","τα","οποία","μεταφέρουν","τα","πλοία","eις","τας","αγοράς","της","φαντασίας","τα","πλείστα","και","τα","καλύτερα","πράγματα","είναι",
		"κατασκευασμένα","από","λεπτάς","υάλους","και","κεράμους","διαφανείς","και","με","όλην","την","προσοχήν","του","κόσμου","πολλά","σπάνουν","εις","τον","δρόμον","και","πολλά","σπάνουν",
		"όταν","τα","αποβιβάζουν","εις","την","ξηράν","πάσα","δε","τοιαύτη","ζημία","είναι","ανεπανόρθωτος","διότι","είναι","έξω","λόγου","να","γυρίση","οπίσω","το","πλοίον","και","να",
		"παραλάβη","πράγματα","ομοιόμορφα","δεν","υπάρχει","πιθανότης","να","ευρεθή","το","ίδιον","κατάστημα","το","οποίον","τα","επώλει","aι","αγοραί","της","φαντασίας","έχουν",
		"καταστήματα","μεγάλα","και","πολυτελή","αλλ'","όχι","μακροχρονίου", "διαρκείας","aι","συναλλαγαί","των","είναι","βραχείαι","εκποιούν","τα","εμπορεύματά","των","ταχέως","και",
		"διαλύουν","αμέσως","eίναι","πολύ","σπάνιον","εν","πλοίον","επανερχόμενον","να","εύρη","τους","αυτούς","εξαγωγείς","με","τα","αυτά","είδηmία","άλλη","ζημία","προέρχεται","εκ",
		"της","χωρητικότητος","των","πλοίων","aναχωρούν","από","τους","λιμένας","των","ευμαρών","ηπείρων","καταφορτωμένα","και","έπειτα","όταν","ευρεθούν","εις","την","ανοικτήν",
		"θάλασσαν","αναγκάζονται","να","ρίψουν","εν","μέρος","εκ","του","φορτίου","δια","να","σώσουν","το","όλον","oύτως","ώστε","ουδέν","σχεδόν","πλοίον","κατορθώνει","να","φέρη",
		"ακεραίους","τους","θησαυρούς","όσους","παρέλαβε","tα","απορριπτόμενα","είναι","βεβαίως","τα","ολιγοτέρας","αξίας","είδη","αλλά","κάποτε","συμβαίνει","οι","ναύται","εν","τη",
		"μεγάλη","των","βία","να","κάμνουν","λάθη","και","να","ρίπτουν","εις","την","θάλασσαν","πολύτιμα","αντικείμεναάμα","δε","τη","αφίξει","εις","τον","λευκόν","χάρτινον","λιμένα",
		"απαιτούνται","νέαι","θυσίαι","πάλιν","έρχονται","οι","αξιωματούχοι","του","τελωνείου","και","εξετάζουν","εν","είδος","και","σκέπτονται","εάν","πρέπη","να","επιτρέψουν","την",
		"εκφόρτωσιν·","αρνούνται","να","αφήσουν","εν","άλλο","είδος","να","αποβιβασθή·","και","εκ","τινων","πραγματειών","μόνον","μικράν","ποσότητα","παραδέχονται","έχει","ο","τόπος",
		"τους","νόμους","του","όλα","τα","εμπορεύματα","δεν","έχουν","ελευθέραν","είσοδον","και","αυστηρώς","απαγορεύεται","το","λαθρεμπόριον","h","εισαγωγή","των","οίνων","εμποδίζεται",
		"διότι","αι","ήπειροι","από","τας","οποίας","έρχονται","τα","πλοία","κάμνουν","οίνους","και","οινοπνεύματα","από","σταφύλια","τα","οποία","αναπτύσσει","και","ωριμάζει",
		"γενναιοτέρα","θερμοκρασία","δεν","τα","θέλουν","διόλου","αυτά","τα","ποτά","οι","αξιωματούχοι","του","τελωνείου","eίναι","πάρα","πολύ","μεθυστικά","δεν","είναι","κατάλληλα",
		"δι’","όλας","τα","κεφαλάς","eξ","άλλου","υπάρχει","μία","εταιρεία","εις","τον","τόπον","η","οποία","έχει","το","μονοπώλιον","των","οίνων","kατασκευάζει","υγρά","έχοντα","το",
		"χρώμα","του","κρασιού","και","την","γεύσιν","του","νερού","και","ημπορείς","να","πίνης","όλην","την","ημέραν","από","αυτά","χωρίς","να","ζαλισθής","διόλου","eίναι","εταιρεία",
		"παλαιά","xαίρει","μεγάλην","υπόληψιν","και","αι","μετοχαί","της","είναι","πάντοτε","υπερτιμημέναιaλλά","πάλιν","ας","είμεθα","ευχαριστημένοι","όταν","τα","πλοία","εμβαίνουν",
		"εις","τον","λιμένα","ας","είναι","και","με","όλας","αυτάς","τας","θυσίας","διότι","τέλος","πάντων","με","αγρυπνίαν","και","πολλήν","φροντίδα","περιορίζεται","ο","αριθμός","των",
		"θραυομένων","ή","ριπτομένων","σκευών","κατά","την","διάρκειαν","του","ταξιδίου","eπίσης","οι","νόμοι","του","τόπου","και","οι","τελωνειακοί","κανονισμοί","είναι","μεν",
		"τυραννικοί","κατά","πολλά","αλλ'","όχι","και","όλως","αποτρεπτικοί","και","μέγα","μέρος","του","φορτίου","αποβιβάζεται","oι","δε","αξιωματούχοι","του","τελωνείου","δεν","είναι",
		"αλάνθαστοι","και","διάφορα","από","τα","εμποδισμένα","είδη","περνούν","εντός","απατηλών","κιβωτίων","που","γράφουν","άλλο","από","επάνω","και","περιέχουν","άλλο","και",
		"εισάγονται","μερικοί","καλοί","οίνοι","δια","τα","εκλεκτά","συμπόσιαθλιβερόν","θλιβερόν","είναι","άλλο","πράγμα","eίναι","όταν","περνούν","κάτι","πελώρια","πλοία","με",
		"κοράλλινα","κοσμήματα","και","ιστούς","εξ","εβένου","με","αναπεπταμένας","μεγάλας","σημαίας","λευκάς","και","ερυθράς","γεμάτα","με","θησαυρούς","τα","οποία","ούτε","πλησιάζουν",
		"καν","εις","τον","λιμένα","είτε","διότι","όλα","τα","είδη","τα","οποία","φέρουν","είναι","απηγορευμένα","είτε","διότι","δεν","έχει","ο","λιμήν","αρκετόν","βάθος","δια","να","τα",
		"δεχθή","kαι","εξακολουθούν","τον","δρόμον","των","oύριος","άνεμος","πνέει","επί","των","μεταξωτών","των","ιστίων","ο","ήλιος","υαλίζει","την","δόξαν","της","χρυσής","των",
		"πρώρας", "και","απομακρύνονται","ηρέμως","και","μεγαλοπρεπώς","απομακρύνονται","δια","παντός","από","ημάς","και","από","τον","στενόχωρον","λιμένα","μαςeυτυχώς","είναι",
		"πολύ","σπάνια","αυτά","τα","πλοία","mόλις","δύο","τρία","βλέπομεν","καθ'","όλον","μας","τον","βίον","tα","λησμονώμεν","δε","ογρήγορα","όσω","λαμπρά","ήτο","η","οπτασία",
		"τόσω","ταχεία","είναι","η","λήθη","της","kαι","αφού","περάσουν","μερικά","έτη","εάν","καμίαν","ημέραν","-","ενώ","καθήμεθα","αδρανώς","βλέποντες","το","φως","ή","ακούοντες",
		"την","σιωπήν","τυχαίως","επανέλθουν","εις","την","νοεράν","μας","ακοήν","στροφαί","τινες","ενθουσιώδεις","δεν","τας","αναγνωρίζομεν","κατ'","αρχάς","και","τυραννώμεν",
		"την","μνήμην","μας","δια","να","ενθυμηθώμεν","πού","ηκούσαμεν","αυτάς","πριν","mετά","πολλού","κόπου","εξυπνάται","η","παλαιά","ανάμνησις","και","ενθυμώμεθα","ότι","αι",
		"στροφαί","αύται","είναι","από","το","άσμα","το","οποίον","έψαλλον","οι","ναύται","ωραίοι","ως","ήρωες","της","iλιάδος","όταν","επερνούσαν","τα","μεγάλα","τα","θεσπέσια",
		"πλοία","και","επροχώρουν","πηγαίνοντα","τις","ηξεύρει","πού"
	];
	
	function lorem(count,source){/**
		*	@param count  when positive number of words to use. when negative use (-count) +- random(20%)
		*	@param source	can be 'latin', 'greek', or array of words
		*/
		let max=(count>0)?count:(-count)*(1.2-Math.random()*0.4);
		Array.isArray(source) || (source=(source=='greek')?greek:latin);
		let ret='',pending=false,indent='';
		for(let s=Math.random()*source.length|0,w,i=0,j=0,k=0; pending || (i<max); i++, s++ ){		
			w=source[s % source.length];
			ret+=indent+(j?w:w[0].toUpperCase()+w.slice(1));
			indent=' ';
			if((++j>7)&&(Math.random()<0.3)){
				j=0; ret+='.';				
				if(!k && (i>count)){
					break;
				}else
				if((++k>3)&&(Math.random()<0.3)){
					indent='\r\n'; k=0;
				};
				pending=false;
			}else{				
				pending=k && j;
			};
		}
		return ret;
	};
	
	if(exports){
		exports.module=sJslDoc;
	}else{
		//console.log('b');
		let scriptTags = document.getElementsByTagName('script');
		let ns=(/^.+\?ns=(\w+)/.exec(scriptTags[scriptTags.length - 1].getAttribute('src')||'')||[,'lorem'])[1];
		window[ns]=lorem;
	}	
})(typeof exports === 'undefined'? undefined: exports);
