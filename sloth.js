define('Sloth', function(){
	//some private vars
	var slice = Array.prototype.slice,
		win = window,
		wTop,
		wBottom,
		undef,
		delegate = win.setTimeout,
		branches = [],
		Branch = function(element, threshold, callback){
			this.element = element;
			this.threshold = threshold;
			this.callback = function(){
				callback(element);
			};
		},
		execute = function(){
			var i = branches.length,
				branch;

			if(!i) {
				win.removeEventListener('scroll', execute);
			} else {
				wTop = win.scrollY;
				wBottom = wTop + win.innerHeight;

				while( i-- ){
					branch = branches[i];

					if (branch.isVisible()) {
						delegate( branch.callback, 0 );
						branches.splice(i, 1);
					}
				}

			}
		};

	Branch.prototype.isVisible = function(){
		var elem =  this.element,
			threshold = this.threshold,
			top = elem.offsetTop - threshold,
			bottom = top + elem.offsetHeight + threshold;

		return wBottom >= top && wTop <= bottom;
	};

	var setup = function(){
		execute();
		branches.length && win.addEventListener('scroll', execute);
	};

	//return Sloth function
	return function(params){
		if(params) {
			var elements = params.on,
				threshold = params.threshold !== undef ? params.threshold : 100,
				callback = params.callback,
				i;

			if(!elements) throw 'No elements passed';
			if(!callback) throw 'No callback passed';

			if(elements instanceof NodeList){
				elements = slice.call(elements);
				i = elements.length;

				while(i--) branches.push(new Branch(elements[i], threshold, callback));
			}else {
				branches.push(new Branch(elements, threshold, callback))
			}

			setup();
		} else{
			throw 'Gimme some data';
		}
	}
});