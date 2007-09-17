
		<?php $wordpress->the_post();  ?>
		<?php if ($wordpress->is_category) { ?>
		
		<h2 class="sub">Archive for the &#8216;<?php single_cat_title(); ?>&#8217; Category</h2>
		
		<?php } elseif ($wordpress->is_day) { ?>
		
		<h2 class="sub">Archive for <?php the_time('F jS, Y'); ?></h2>

		<?php } elseif ($wordpress->is_month) { ?>
		
		<h2 class="sub">Archive for <?php the_time('F, Y'); ?></h2>

		<?php } elseif ($wordpress->is_year) { ?>
		
		<h2 class="sub">Archive for <?php the_time('Y'); ?></h2>

		<?php } elseif ($wordpress->is_author) { ?>
		
		<h2 class="sub">Author Archive</h2>

		<?php } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
		
		<h2 class="sub">Blog Archives</h2>

		<?php } ?>
		
		<!-- POSTS -->
		
		<?php while ($wordpress->have_posts()) : $wordpress->the_post();  ?>

			<div class="post" id="post-<?php the_ID(); ?>">
				<h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h2>
				<small><?php the_time('F jS, Y') ?> by <?php the_author() ?></small>

				<div class="entry">
					<?php the_excerpt() ?>
				</div>
				
				<p class="postmetadata">Posted in <?php the_category(', ') ?> | <?php edit_post_link('Edit', '', ' | '); ?>  <?php comments_popup_link('No Comments &#187;', '1 Comment &#187;', '% Comments &#187;'); ?></p>
				
			</div>

		<?php endwhile; ?>

		<div class="navigation">
			<div class="alignleft"><?php next_posts_link('&laquo; Older Results') ?></div>
			<div class="alignright"><?php previous_posts_link('Newer Results &raquo;') ?></div>
		</div>
		
		