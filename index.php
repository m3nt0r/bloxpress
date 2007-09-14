<?php get_header(); ?>

	<div id="layout">
		<div id="drop_1" class="dropspot">
			<ul id="sidebar-1" class="sortable">			
				<?php if (!renderSidebar(1)) : ?>
					<li>nothing here</li>
				<?php endif; ?>
			</ul>	
		</div>
		<div id="drop_2" class="dropspot">
			<ul id="sidebar-2" class="sortable">
				<?php if (!renderSidebar(2)) : ?>
					<li>nothing here</li>
				<?php endif; ?>
			</ul>
		</div>
		<div id="drop_3" class="dropspot">
			<ul id="sidebar-3" class="sortable">
				<?php if (!renderSidebar(3)) : ?>
					<li>nothing here</li>
				<?php endif; ?>
			</ul>
		</div>
		<br style="clear:both" />
	</div>

<?php get_footer(); ?>