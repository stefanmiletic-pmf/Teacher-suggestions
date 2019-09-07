export default class FeedsGenerator {
		
		
		
			
		
			static 
			returnFeedHeaderTab() {
				return document.getElementById("postTabSelection");
			}
			
			
		
			static 
			returnShowcasePanel() {
				return document.getElementsByClassName("feeds-main")[0];
			}
			
			
			
			static 
			returnFeedsViewPanel() {
				return document.getElementsByClassName("feeds-view")[0];
			}
			
			
			
				
			static
			twoDigits(d) {
				if(0 <= d && d < 10) return "0" + d.toString();
				if(-10 < d && d < 0) return "-0" + (-1*d).toString();
				return d.toString();
			}

			static
			toMysqlFormat() {
				return this.getUTCFullYear() + "-" + FeedsGenerator.twoDigits(1 + this.getUTCMonth()) + "-" + FeedsGenerator.twoDigits(this.getUTCDate()) + " " + FeedsGenerator.twoDigits(this.getUTCHours()) + ":" + FeedsGenerator.twoDigits(this.getUTCMinutes()) + ":" + FeedsGenerator.twoDigits(this.getUTCSeconds());
			}
		
		
		
		
		
			

		
		
		
		}
		
		
		